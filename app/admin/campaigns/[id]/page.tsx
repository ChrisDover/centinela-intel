import AdminNav from "../../components/AdminNav";
import CampaignDetailClient from "./CampaignDetailClient";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-centinela-bg-primary text-centinela-text-primary">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <CampaignDetailClient id={id} />
      </main>
    </div>
  );
}
