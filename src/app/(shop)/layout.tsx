import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomFooter from "@/components/layout/BottomFooter";
import CallToAction from "@/components/layout/CallToAction";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="w-full">{children}</main>
      <CallToAction />
      <Footer />
      <BottomFooter />
    </>
  );
}