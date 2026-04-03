import DashboardContent from "./DashboardContent";
import { getDictionary, Locale } from "@/lib/get-dictionary";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <DashboardContent dict={dict} />;
}
