import type { Metadata } from "next";
import { Outfit, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { ClientSocketProvider } from "@/lib/socket/ClientSocketProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codev Play",
  description: "Where Codev hangout and play — a friendly space to experiment, learn, and build together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${roboto.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ClientSocketProvider>
              <div className="flex min-h-screen">
                <div className="flex-1 flex flex-col">
                  <main>{children}</main>
                </div>
              </div>
              <Toaster />
            </ClientSocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
