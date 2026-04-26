import localFont from "next/font/local";
import "./globals.css";

const textFont = localFont({
  src: "./../../public/fonts/couriercyrps.ttf",
  variable: "--font-text",
});

const textFontBold = localFont({
  src: "./../../public/fonts/couriercyrps_bold.ttf",
  variable: "--font-text-bold",
});

const textFontItalic = localFont({
  src: "./../../public/fonts/couriercyrps_inclined.ttf",
  variable: "--font-text-italic",
});

const textFontBoldItalic = localFont({
  src: "./../../public/fonts/couriercyrps_boldinclined.ttf",
  variable: "--font-text-bold-italic",
});

const textDecorative = localFont({
  src: "./../../public/fonts/TrixieCyr-Plain.ttf",
  variable: "--font-text-decorative",
})

const headerFont = localFont({
  src: "./../../public/fonts/Capture it.ttf",
  variable: "--font-header",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`
      ${textFont.variable}
      ${textFontBold.variable}
      ${textFontItalic.variable}
      ${textFontBoldItalic.variable}
      ${textDecorative.variable}
      ${headerFont.variable}
    `}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}