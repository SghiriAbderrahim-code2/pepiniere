// Central store identity + contact information.
// Values are read from public env vars (see .env.local / .env.example) so the
// brand name, phone, location and maps link live in one place and are reused
// across the Navbar, Footer, Contact page, Homepage hero and SEO metadata.

export const store = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "Pépinière Al Akhawayn",
  nameAr: process.env.NEXT_PUBLIC_STORE_NAME_AR ?? "مشتل الأخوين",
  activity: "مشتل للنباتات والزهور",
  phone: process.env.NEXT_PUBLIC_STORE_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  location: process.env.NEXT_PUBLIC_STORE_LOCATION ?? "مكناس، المغرب",
  locationDetails:
    process.env.NEXT_PUBLIC_STORE_LOCATION_DETAILS ??
    "بجانب Salle Couverte Al Massira",
  locationUrl:
    process.env.NEXT_PUBLIC_STORE_LOCATION_URL ??
    "https://maps.app.goo.gl/JeoHd19XPPuMVbgE9",
  latitude: process.env.NEXT_PUBLIC_STORE_LATITUDE ?? "33.9029587",
  longitude: process.env.NEXT_PUBLIC_STORE_LONGITUDE ?? "-5.5338072",
} as const;

// Digits-only phone, suitable for tel: and wa.me links.
export function storePhoneDigits(): string {
  return store.phone.replace(/\D/g, "");
}
