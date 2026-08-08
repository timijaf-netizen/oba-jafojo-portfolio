import AdminApp from "@/components/admin/AdminApp";

export const metadata = {
  title: "Admin — Oba Jafojo Portfolio",
  robots: { index: false, follow: false },
};

// Admin is fully client-side (auth + editing), so never statically prerender.
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminApp />;
}
