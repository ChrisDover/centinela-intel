import AdminNav from "../components/AdminNav";
import SubscribersClient from "./SubscribersClient";

export default function SubscribersPage() {
  return (
    <div className="min-h-screen bg-centinela-bg-primary text-centinela-text-primary">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <SubscribersClient />
      </main>
    </div>
  );
}
