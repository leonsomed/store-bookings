import * as te from 'tw-elements';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="bg-slate-100">{children}</body>
    </html>
  );
}
