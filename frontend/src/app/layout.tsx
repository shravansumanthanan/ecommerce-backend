import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "NexusMarket",
  description: "High-performance e-commerce engine",
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
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d0d0d',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0px',
              fontFamily: 'monospace',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            },
            success: {
              iconTheme: {
                primary: '#F95724',
                secondary: '#0d0d0d',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
