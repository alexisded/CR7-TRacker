import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cristiano Ronaldo (CR7) Goal Tracker | Road to 1000",
  description: "Sigue en tiempo real los goles de Cristiano Ronaldo, sus estadísticas por equipo, noticias y su rutina de disciplina y salud. Camino a los 1000 goles oficiales.",
  keywords: ["CR7", "Cristiano Ronaldo", "Goles", "Contador de Goles", "Al Nassr", "Portugal", "Real Madrid", "Manchester United", "Salud CR7", "Disciplina CR7"],
  openGraph: {
    title: "CR7 Goal Tracker | Road to 1000",
    description: "Estadísticas actualizadas al minuto de Cristiano Ronaldo.",
    images: ["/cr7-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
