import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { alternates, ogLocale, SITE_URL } from "@/lib/seo";
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", weight: ["300", "400", "500", "600", "700"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["400", "500"] });

export const generateStaticParams = () => locales.map((lang) => ({ lang }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDict(lang).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: t.title,
    description: t.description,
    alternates: alternates(lang, ""),
    openGraph: {
      type: "website",
      siteName: "Alexie Romeu",
      title: t.title,
      description: t.description,
      url: `/${lang}`,
      locale: ogLocale[lang],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <Nav lang={lang} t={getDict(lang).nav} />
        {children}
        <Footer t={getDict(lang).footer} />
      </body>
    </html>
  );
}
