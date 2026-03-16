import "./globals.css";
import "swiper/css";
import "remixicon/fonts/remixicon.css";
import { Inter } from "next/font/google";
import { Country, Currency, DefaultResponse, Language, Paginate, Setting } from "@/types/global";
import { Metadata } from "next";
import { parseSettings } from "@/utils/parse-settings";
import { cookies } from "next/headers";
import React from "react";
import clsx from "clsx";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import ThemeProvider from "./theme-provider";
import GlobalProvider from "./global-provider";
import QueryClientProvider from "./query-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

// Static metadata - no API calls during build
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000'),
  title: {
    template: `%s | Kadin Marketplace`,
    default: 'Kadin Marketplace',
  },
  description: "E-commerce marketplace",
  openGraph: {
    title: 'Kadin Marketplace',
    description: "E-commerce marketplace",
    siteName: 'Kadin Marketplace',
  },
};

export default async ({ children }: { children: React.ReactNode }) => {
  // Use static defaults for faster loading - API calls moved to client-side
  const enhancedLanguages = [
    {
      id: 1,
      locale: "en",
      title: "English",
      active: 1,
      backward: 0,
      default: 1,
      img: "",
    },
    {
      id: 999,
      locale: "ar",
      title: "العربية",
      active: 1,
      backward: 1,
      default: 0,
      img: "",
    },
  ];

  const defaultCurrencies = [
    {
      id: 1,
      title: "USD",
      symbol: "$",
      rate: 1,
      active: 1,
      default: 1,
    }
  ];

  const parsedSettings = {
    title: 'Kadin Marketplace',
    currency_id: '1',
    system_lang: 'en',
    ui_type: process.env.NEXT_PUBLIC_UI_TYPE || '1',
    favicon: '/favicon.ico',
    logo: '/logo.png'
  };

  const defaultCountry = null;

  // Priority: localStorage (via inline script) > cookie > default
  const selectedLocale = cookies().get("lang")?.value;
  const selectedDirection = cookies().get("dir")?.value;
  const defaultLanguage = enhancedLanguages?.find((lang) => Boolean(lang.default));

  const css = `
    :root {
       --primary: ${parsedSettings?.ui_type === "4" ? "#FE7200" : "#E34F26"} 
    }
`;

  return (
    <html
      lang={selectedLocale || defaultLanguage?.locale || "en"}
      dir={selectedDirection || (defaultLanguage?.backward ? "rtl" : "ltr")}
      suppressHydrationWarning
    >
      <head>
        <style>{css}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedLang = localStorage.getItem('lang');
                  var storedDir = localStorage.getItem('dir');
                  var i18nextLng = localStorage.getItem('i18nextLng');
                  var html = document.documentElement;
                  
                  if (storedLang && i18nextLng && storedLang !== i18nextLng) {
                    localStorage.setItem('i18nextLng', storedLang);
                  } else if (!storedLang && i18nextLng) {
                    localStorage.setItem('lang', i18nextLng);
                    storedLang = i18nextLng;
                  } else if (storedLang && !i18nextLng) {
                    localStorage.setItem('i18nextLng', storedLang);
                  }
                  
                  if (storedLang) {
                    html.setAttribute('lang', storedLang);
                  }
                  if (storedDir) {
                    html.setAttribute('dir', storedDir);
                  }
                } catch (e) {
                  console.warn('Failed to initialize language from localStorage:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={clsx(
          inter.className,
          "dark:bg-darkBg",
          parsedSettings?.ui_type === "3" && "bg-gray-segment",
          parsedSettings?.ui_type === "4" && "bg-gray-float"
        )}
      >
        <GlobalProvider
          languages={enhancedLanguages}
          currencies={defaultCurrencies}
          settings={parsedSettings}
          defaultCountry={defaultCountry}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <QueryClientProvider>{children}</QueryClientProvider>
          </ThemeProvider>
        </GlobalProvider>
        <div id="portal" />
      </body>
    </html>
  );
};