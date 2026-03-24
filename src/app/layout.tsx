import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomFooter   from "@/components/layout/BottomFooter";
import CallToAction from "@/components/layout/CallToAction";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black" suppressHydrationWarning>
        <Navbar />
        <main className="w-full">
        {children}
        </main>
        <CallToAction />
        <Footer />
        <BottomFooter />
      </body>
    </html>
  );
}
