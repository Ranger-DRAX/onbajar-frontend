import "./globals.css";
import SWRProvider from "@/providers/SWRProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black" suppressHydrationWarning>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
