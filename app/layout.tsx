import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revizz — Tes cours deviennent tes meilleurs outils de révision",
  description: "Scanne, vérifie et révise avec des outils adaptés à ton cours.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
