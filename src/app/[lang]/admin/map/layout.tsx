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
    title: dict.map?.title || "Strategic Recovery Map",
  };
}

export default function AdminMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
