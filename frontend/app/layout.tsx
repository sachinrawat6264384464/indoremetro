import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";

export const metadata = {
  title: "Indore Metro — Complete Digital Web Platform",
  description: "Official digital web platform for Indore Metro Rail Corporation (MPMRCL). Plan journeys, calculate fares, view timetables, and book digital QR tickets online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#090D16] text-slate-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
