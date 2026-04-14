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
  title: "BiyahengTipid - Go Further for Less | Smart Route Optimization",
  description: "Optimize your local commutes, deliveries, or road trips perfectly. Discover smarter driving routes, efficient waypoint ordering, and save massively on fuel and time.",
  keywords: [
    "route optimization",
    "travel planner",
    "fuel saver",
    "route planner",
    "commute optimizer",
    "waypoint sequencing",
    "BiyahengTipid",
    "Philippines"
  ],
  authors: [{ name: "BiyahengTipid Team" }],
  openGraph: {
    title: "BiyahengTipid - Go Further for Less",
    description: "Optimize your local commutes, deliveries, or road trips perfectly to save massively on fuel and time.",
    type: "website",
    locale: "en_PH",
    siteName: "BiyahengTipid",
    images: [
      {
        url: "/img/biyaheng_tipid_brand.png",
        width: 1200,
        height: 630,
        alt: "BiyahengTipid - Go Further for Less",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
