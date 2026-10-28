import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Français par défaut : la racine renvoie vers /fr.
  async redirects() {
    return [{ source: "/", destination: "/fr", permanent: false }];
  },
};

// Les études de cas sont écrites en MDX (content/cases/<langue>/<slug>.mdx).
export default createMDX({})(nextConfig);
