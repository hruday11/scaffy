import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scaffy - Backend Generator",
  description: "Generate production-ready backend code from natural language prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-cyber-black">
      <body className={`${inter.className} min-h-screen text-white antialiased`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1b23',
              color: '#fff',
              border: '1px solid rgba(0, 179, 255, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}
