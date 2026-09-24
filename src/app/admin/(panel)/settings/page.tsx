import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <PageTitle title="Site settings" subtitle="Business details, homepage content, opening hours, social links and SEO." />
      <SettingsForm initial={s} />
    </>
  );
}
