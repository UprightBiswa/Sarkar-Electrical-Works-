import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import ServiceForm from "../ServiceForm";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Services
      </Link>
      <PageTitle title="New service" />
      <ServiceForm />
    </>
  );
}
