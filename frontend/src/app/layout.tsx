import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "NexusMarket | Premium E-Commerce",
  description: "Next-generation e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={spaceGrotesk.className}>
        <Navbar />
        <main className="pt-24 min-h-screen pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
