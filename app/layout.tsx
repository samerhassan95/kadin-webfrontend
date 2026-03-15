import fetcher from "@/lib/fetcher";
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

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL),
    title: {
      template: `%s | ${parsedSettings.title}`,
      default: parsedSettings.title,
    },
    icons: parsedSettings.favicon,
    description: "E-commerce marketplace",
    openGraph: {
      images: [
        {
          url: parsedSettings.logo,
          width: 200,
          height: 200,
        },
      ],
      title: parsedSettings.title,
      description: "E-commerce marketplace",
      siteName: parsedSettings.title,
    },
  };
};

export default async ({ children }: { children: React.ReactNode }) => {
  const languages = await fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", {
    cache: "no-cache",
  });
  const currencies = await fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active");

  // Add Arabic language support (client-side only)
  // The backend only supports English, but we handle Arabic translations on the frontend
  const enhancedLanguages: Language[] = [
    ...(languages?.data || []),
    // Add Arabic if it's not already in the API response
    ...(!languages?.data?.some((lang) => lang.locale === "ar")
      ? [
          {
            id: 999, // Use a high ID to avoid conflicts
            locale: "ar",
            title: "العربية",
            active: 1,
            backward: 1, // RTL language
            default: 0,
            img: "", // You can add an Arabic flag image URL here if needed
          },
        ]
      : []),
  ];

  // Priority: localStorage (via inline script) > cookie > default
  // We'll let the inline script handle this, so we use cookie values as fallback
  const selectedLocale = cookies().get("lang")?.value;
  const selectedDirection = cookies().get("dir")?.value;

  const defaultLanguage = enhancedLanguages?.find((lang) => Boolean(lang.default));
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  }).then((res) => res.data);
  const parsedSettings = parseSettings(settings);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  const cookieCountryId = cookies().get("country_id")?.value;
  let countries;
  try {
    countries = await fetcher<Paginate<Country>>(
      buildUrlQueryParams("v1/rest/countries", { has_price: true, country_id: cookieCountryId })
    );
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    countries = { data: [] };
  }

  const ipInfo = null;
  // Disabled IP detection to avoid rate limiting
  // try {
  //   ipInfo = await fetch("https://ipapi.co/json/").then((ip) => ip.json());
  // } catch (error) {
  //   console.error("Failed to fetch IP info:", error);
  // }
  const defaultCountry = countries?.data?.[0] || null;

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
                  
                  console.log('Layout script - Initial values:', { lang: storedLang, dir: storedDir, i18nextLng: i18nextLng });
                  
                  // Sync localStorage keys if they're out of sync
                  if (storedLang && i18nextLng && storedLang !== i18nextLng) {
                    console.log('Layout script - Syncing mismatched keys, using lang:', storedLang);
                    localStorage.setItem('i18nextLng', storedLang);
                  } else if (!storedLang && i18nextLng) {
                    console.log('Layout script - Using i18nextLng as lang:', i18nextLng);
                    localStorage.setItem('lang', i18nextLng);
                    storedLang = i18nextLng;
                  } else if (storedLang && !i18nextLng) {
                    console.log('Layout script - Syncing lang to i18nextLng:', storedLang);
                    localStorage.setItem('i18nextLng', storedLang);
                  }
                  
                  // Apply stored values immediately to prevent flash
                  if (storedLang) {
                    html.setAttribute('lang', storedLang);
                    console.log('Layout script - Applied lang:', storedLang);
                  }
                  if (storedDir) {
                    html.setAttribute('dir', storedDir);
                    console.log('Layout script - Applied dir:', storedDir);
                  }
                  
                  // Listen for storage changes to update attributes (for cross-tab sync)
                  window.addEventListener('storage', function(e) {
                    if ((e.key === 'lang' || e.key === 'i18nextLng') && e.newValue) {
                      html.setAttribute('lang', e.newValue);
                      // Sync both keys
                      if (e.key === 'lang') {
                        localStorage.setItem('i18nextLng', e.newValue);
                      } else {
                        localStorage.setItem('lang', e.newValue);
                      }
                      console.log('Layout script - Storage event synced:', e.key, e.newValue);
                    }
                    if (e.key === 'dir' && e.newValue) {
                      html.setAttribute('dir', e.newValue);
                    }
                  });
                  
                  // Listen for direct localStorage changes in same tab
                  var originalSetItem = localStorage.setItem;
                  localStorage.setItem = function(key, value) {
                    originalSetItem.apply(this, arguments);
                    if (key === 'lang' || key === 'i18nextLng') {
                      html.setAttribute('lang', value);
                      // Keep both keys in sync
                      if (key === 'lang') {
                        originalSetItem.call(this, 'i18nextLng', value);
                      } else {
                        originalSetItem.call(this, 'lang', value);
                      }
                      console.log('Layout script - Direct localStorage sync:', key, value);
                    }
                    if (key === 'dir') {
                      html.setAttribute('dir', value);
                    }
                  };
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
          currencies={currencies?.data}
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
