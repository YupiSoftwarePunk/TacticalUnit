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
    <html lang="ru" suppressHydrationWarning className={`
      ${textFont.variable}
      ${textFontBold.variable}
      ${textFontItalic.variable}
      ${textFontBoldItalic.variable}
      ${textDecorative.variable}
      ${headerFont.variable}
    `}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Если выбор есть — ставим его, если нет — смотрим систему
                  const theme = savedTheme || 'system';
                  
                  if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}