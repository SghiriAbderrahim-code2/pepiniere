import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { store } from "@/lib/store";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

async function getInitialDark(): Promise<boolean> {
  const store = await cookies();
  const theme = store.get("theme")?.value;
  return theme === "dark";
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://pepiniere-al-akhawayn.example",
  ),
  title: {
    default: `${store.name} | ${store.nameAr}`,
    template: `%s | ${store.name}`,
  },
  description: `${store.name} – ${store.nameAr} في ${store.location}. اكتشف مجموعة متنوعة من النباتات والزهور واختر النباتات المناسبة لمساحتك.`,
  openGraph: {
    type: "website",
    locale: "ar_MA",
    siteName: store.name,
    title: `${store.name} | ${store.nameAr}`,
    description: `${store.name} – ${store.nameAr} في ${store.location}. اكتشف مجموعة متنوعة من النباتات والزهور.`,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialDark = await getInitialDark();
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable}${initialDark ? " dark" : ""}`}
    >
      <body className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider defaultTheme="system">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton floating />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
