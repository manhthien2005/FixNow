import { FloatingContact } from "@/components/layout/floating-contact";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
