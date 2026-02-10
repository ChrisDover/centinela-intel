import AdminNav from "../components/AdminNav";
import InsightsClient from "./InsightsClient";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-centinela-bg-primary text-centinela-text-primary">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <InsightsClient />
      </main>
    </div>
  );
}
