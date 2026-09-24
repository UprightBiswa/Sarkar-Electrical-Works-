import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingActions from "@/components/site/FloatingActions";
import Tracker from "@/components/site/Tracker";
import { getActiveServices, getSettings } from "@/lib/data";

// ISR: pages are served from the CDN and regenerated at most hourly,
// or immediately when an admin edits content (revalidateTag/revalidatePath).
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services] = await Promise.all([getSettings(), getActiveServices().catch(() => [])]);
  return (
    <>
      <Header shopName={s.shopName} phone={s.phone} />
      <main className="overflow-x-clip">{children}</main>
      <Footer s={s} services={services} />
      <FloatingActions phone={s.phone} whatsapp={s.whatsapp} shopName={s.shopName} />
      <Tracker />
    </>
  );
}
