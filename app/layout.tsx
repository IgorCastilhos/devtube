import {ClerkProvider} from "@clerk/nextjs";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {Toaster} from "@/components/ui/toaster";
import {ConfettiProvider} from "@/components/providers/confetti-provider";

const INTER = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "DevTube",
    description: "Plataforma de cursos para desenvolvedores",
    authors: [{name: "Igor Paprocki de Castilhos", url: "https://igor-castilhos.vercel.app/"}],
    keywords: ["DevTube", "Cursos", "Desenvolvedores"],
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="pt-BR">
            <body className={INTER.className}>
            <ConfettiProvider/>
            <Toaster/>
            {children}
            </body>
            </html>
        </ClerkProvider>
    );
}
