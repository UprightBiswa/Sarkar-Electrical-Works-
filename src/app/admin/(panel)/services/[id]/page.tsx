import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import ServiceForm from "../ServiceForm";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const [service] = await db.select().from(schema.services).where(eq(schema.services.id, Number(id)));
  if (!service) notFound();
  return (
    <>
      <Link href="/admin/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Services
      </Link>
      <PageTitle title={`Edit: ${service.title}`} />
      <ServiceForm service={service} />
    </>
  );
}
