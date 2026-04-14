
import { Poppins } from "next/font/google";
import "@/app/globals.css";


const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
})

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
                {children}
            </body>
        </html>
    );
}
