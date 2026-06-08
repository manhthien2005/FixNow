import { redirect } from "next/navigation";

import { AdminTopbar } from "@/components/layout/admin-topbar";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <AdminTopbar />
      <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30 md:min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </>
  );
}
