import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import AuthButtons from '@/components/AuthButtons';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scaffy - Backend Generator",
  // description: "Generate production-ready backend code from natural language prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClerkProvider>
            <div className="fixed top-6 right-8 z-50 flex gap-4">
              <AuthButtons />
              <ThemeToggle />
            </div>
            <main className="min-h-screen bg-gradient-to-b from-cyber-black to-cyber-dark dark:from-cyber-light dark:to-cyber-lightCard">
              {children}
            </main>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'rgb(26, 27, 35)',
                  color: '#fff',
                  border: '1px solid rgba(0, 179, 255, 0.2)',
                },
              }}
            />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
