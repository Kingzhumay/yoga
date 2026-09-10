import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/site/Navbar";
import { OfferBanner } from "@/components/site/OfferBanner";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Classes } from "@/components/site/Classes";
import { Instructor } from "@/components/site/Instructor";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { PriceCalculator } from "@/components/site/PriceCalculator";
import { Location } from "@/components/site/Location";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { site, mapLink } from "@/lib/site";

const title = "Veda Yoga Studio — Yoga Classes in Uttam Nagar, Delhi";
const description =
  "Group, personal, women's, aerial and yoga wheel therapy classes in Jeevan Park, Uttam Nagar, New Delhi. Certified instruction, 5.0 rated, free trial class.";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: site.name,
  description,
  slogan: site.tagline,
  url: "/",
  telephone: [`+91${site.phonePrimary}`, `+91${site.phoneSecondary}`],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: mapLink,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "06:00",
      closes: "20:00",
    },
  ],
  sameAs: [site.instagram, site.youtube],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating,
    reviewCount: site.reviewCount,
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "IN-DL" },
      { name: "geo.placename", content: "Uttam Nagar, New Delhi" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusiness) }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <OfferBanner />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Classes />
        <Instructor />
        <Gallery />
        <Testimonials />
        <PriceCalculator />
        <Location />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
