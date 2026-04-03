import { Metadata } from "next";
import { getDictionary, Locale } from "@/lib/get-dictionary";
import AdminRootLayoutClient from "./AdminRootLayoutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: {
      default: dict.common.dashboard || "Dashboard Admin",
      template: `%s | ${dict.common.dashboard || "Dashboard Admin"}`
    }
  };
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRootLayoutClient>{children}</AdminRootLayoutClient>;
}
