import { Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
});

const stengazeta = localFont({
  src: "./../../public/fonts/Stengazeta-Regular_5.ttf",
  variable: "--font-stengazeta",
});

const captureIt = localFont({
  src: "./../../public/fonts/Capture it.ttf",
  variable: "--font-capture",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`
      ${nunito.variable} 
      ${stengazeta.variable} 
      ${captureIt.variable}
    `}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}