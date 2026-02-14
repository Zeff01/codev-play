import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ClientSocketProvider } from "@/lib/socket/ClientSocketProvider";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ClientSocketProvider>
                <div className="flex min-h-screen">
                    <Sidebar />

                    <div className="flex flex-1 flex-col">
                        <Header />

                        <main className="flex-1">{children}</main>

                        <Footer />
                    </div>
                </div>
                <Toaster />
            </ClientSocketProvider>
        </AuthProvider>
    );
}
