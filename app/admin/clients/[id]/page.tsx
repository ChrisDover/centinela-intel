import AdminNav from "../../components/AdminNav";
import ClientDetailClient from "./ClientDetailClient";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-centinela-bg-primary text-centinela-text-primary">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <ClientDetailClient id={id} />
      </main>
    </div>
  );
}
