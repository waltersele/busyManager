import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BusyManager — La Matriz',
  description: 'Dashboard de organización',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
