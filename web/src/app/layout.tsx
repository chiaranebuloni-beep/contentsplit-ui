import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { ClientProvider } from "@/contexts/client-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContentSplit â AI Content Repurposing",
  description:
    "Transform any article or blog post into ready-to-publish social media content with AI-powered generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider>
          <AuthProvider>
            <ClientProvider>{children}</ClientProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
