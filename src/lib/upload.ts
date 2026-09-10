import { supabase } from "./supabase";

/**
 * Shared image upload helper used by every "upload image" field in the
 * admin panel (classes, pages, etc). Validates the file in the browser
 * BEFORE it's sent anywhere, then uploads it to the public `site-images`
 * bucket in Supabase Storage and returns its public URL.
 *
 * Security note: the Storage RLS policies (see supabase-schema.sql) only
 * allow writes from an authenticated (logged-in admin) session — this
 * client-side validation is for a good user experience, not the security
 * boundary itself.
 */

export const MAX_IMAGE_MB = 4;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MIN_DIMENSION = 200;

export type UploadOptions = {
  /** Target width / height ratio, e.g. 4 / 3 or 1 (square). Omit to allow any ratio. */
  aspectRatio?: number;
  /** Allowed deviation from aspectRatio, as a fraction. Default 0.2 (20%). */
  aspectTolerance?: number;
  /** Storage sub-folder, e.g. "classes" or "pages". Default "uploads". */
  folder?: string;
};

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read this image file. Try a different file."));
    };
    img.src = objectUrl;
  });
}

export async function validateImage(file: File, options: UploadOptions = {}) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG or WEBP images are allowed.");
  }

  const maxBytes = MAX_IMAGE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is ${MAX_IMAGE_MB}MB.`);
  }

  const { width, height } = await readImageDimensions(file);
  if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
    throw new Error(`Image is too small (${width}×${height}px). Minimum is ${MIN_DIMENSION}×${MIN_DIMENSION}px.`);
  }

  if (options.aspectRatio) {
    const ratio = width / height;
    const tolerance = options.aspectTolerance ?? 0.2;
    const diff = Math.abs(ratio - options.aspectRatio) / options.aspectRatio;
    if (diff > tolerance) {
      throw new Error(
        `This image's proportions (${width}×${height}) don't match what's needed here. ` +
          `Please crop it closer to a ${options.aspectRatio.toFixed(2)}:1 ratio and try again.`,
      );
    }
  }

  return { width, height };
}

function safeFileName(file: File) {
  const extFromName = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const ext = extFromName || (file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg");
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now()}-${random}.${ext}`;
}

/** Validates then uploads an image, returning its public URL. Throws a user-readable Error on any failure. */
export async function uploadImage(file: File, options: UploadOptions = {}): Promise<string> {
  if (!supabase) {
    throw new Error("Admin panel isn't connected to Supabase yet — image uploads need that set up first.");
  }

  await validateImage(file, options);

  const folder = (options.folder ?? "uploads").replace(/[^a-z0-9-]/gi, "");
  const path = `${folder}/${safeFileName(file)}`;

  const { error } = await supabase.storage.from("site-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(
      error.message.includes("Bucket not found")
        ? "The image storage bucket hasn't been set up yet. Re-run supabase-schema.sql."
        : error.message,
    );
  }

  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
}
