import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="bg-slate-100 dark:bg-black">{children}</body>
    </html>
  );
}
