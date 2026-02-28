import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex flex-1">
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                <main className="flex-1 md:ml-64">{children}</main>
            </div>
        </div>
    );
}
