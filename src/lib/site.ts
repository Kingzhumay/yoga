import scorpion from "@/assets/scorpion.jpg";
import aerial from "@/assets/aerial.jpg";
import wheel from "@/assets/wheel.jpg";
import instructor from "@/assets/instructor.jpg";
import groupPhoto from "@/assets/group.jpg";

export const images = {
  scorpion: scorpion,
  aerial: aerial,
  wheel: wheel,
  instructor: instructor,
  groupPhoto: groupPhoto,
};

export const site = {
  name: "Veda Yoga Studio",
  tagline: "Healthy Body Mind Soul",
  established: 2024,
  phonePrimary: "8802884319",
  phoneSecondary: "9599202303",
  whatsapp: "918802884319",
  address: {
    street: "C-24, Jeevan Park, Uttam Nagar",
    city: "New Delhi",
    postalCode: "110059",
    country: "IN",
    full: "C-24, Jeevan Park, Uttam Nagar, New Delhi - 110059",
  },
  geo: { lat: 28.6206, lng: 77.0546 },
  hours: "Mon – Sun · 6:00 AM – 8:00 PM",
  instagram: "https://www.instagram.com/manish_vedayoga",
  instagramHandle: "@manish_vedayoga",
  youtube: "https://www.youtube.com/@VedaYogastudio",
  youtubeHandle: "@VedaYogastudio",
  rating: 5.0,
  reviewCount: 100,
};

export const mapEmbedSrc =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("Veda Yoga Studio, C-24 Jeevan Park, Uttam Nagar, New Delhi 110059") +
  "&output=embed";

export const mapLink =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Veda Yoga Studio, C-24 Jeevan Park, Uttam Nagar, New Delhi 110059");

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Public, non-secret endpoints. Web3Forms access keys are publishable by design
 * and the Apps Script URL is a public webhook — no private credentials here.
 * Replace the placeholders with the studio's own keys to go live.
 */
export const endpoints = {
  web3formsKey: "7cbe9453-1e9a-4ff7-a216-3a81651414c7",
  googleSheetsWebhook: "",
};
