import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";



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
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
