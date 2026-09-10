import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

type Props = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  /** e.g. 4/3, 1, 16/9 — omit to allow any photo proportions. */
  aspectRatio?: number;
  /** Human label shown under the field, e.g. "4:3 landscape". */
  aspectLabel?: string;
  folder?: string;
};

export function ImageUploader({ value, onChange, aspectRatio, aspectLabel, folder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, { aspectRatio, folder });
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative shrink-0">
          <img
            src={value}
            alt=""
            className="size-16 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-destructive text-white"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
          <ImagePlus className="size-5" />
        </div>
      )}

      <div className="min-w-0">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        <p className="mt-1 text-[11px] text-muted-foreground">
          JPG, PNG or WEBP · max 4MB{aspectLabel ? ` · ideally ${aspectLabel}` : ""}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
