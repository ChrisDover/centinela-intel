import AdminNav from "../components/AdminNav";
import EmailClient from "./EmailClient";

export default function EmailPage() {
  return (
    <div className="min-h-screen bg-centinela-bg-primary text-centinela-text-primary">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <EmailClient />
      </main>
    </div>
  );
}
