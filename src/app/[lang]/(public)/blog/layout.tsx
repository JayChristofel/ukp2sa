import { Metadata } from "next";
import { getDictionary, Locale } from "@/lib/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: {
      default: dict.nav.blog || "Blog",
      template: `%s | ${dict.nav.blog || "Blog"}`
    },
    description: dict.blog.subtitle || "Portal Berita & Literasi Pemulihan Nasional"
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
