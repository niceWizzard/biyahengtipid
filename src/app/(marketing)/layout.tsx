import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { buttonVariants } from "@/components/ui/button";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: "Biyaheng Tipid",
  description: "A platform to help you save money on your travels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
