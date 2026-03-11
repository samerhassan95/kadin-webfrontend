import fetcher from "@/lib/fetcher";
import "./globals.css";
import "swiper/css";
import "remixicon/fonts/remixicon.css";
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

// Use system fonts as fallback when Google Fonts is unavailable
const inter = { className: "font-sans" };

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
      cache: "no-cache",
    });
    const parsedSettings = parseSettings(settings?.data);
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://kadin.app"),
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
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://kadin.app"),
      title: "Kadin App",
      description: "E-commerce marketplace",
    };
  }
};

export default async ({ children }: { children: React.ReactNode }) => {
  let languages, currencies, settings, countries, defaultLanguage, parsedSettings, defaultCountry;
  
  try {
    languages = await fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", {
      cache: "no-cache",
    });
    currencies = await fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active");
    const selectedLocale = cookies().get("lang")?.value;
    const selectedDirection = cookies().get("dir")?.value;

    defaultLanguage = languages?.data?.find((lang) => Boolean(lang.default));
    settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
      cache: "no-cache",
    }).then((res) => res.data);
    parsedSettings = parseSettings(settings);
    if (process.env.NEXT_PUBLIC_UI_TYPE) {
      parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
    }
    const cookieCountryId = cookies().get("country_id")?.value;
    
    try {
      countries = await fetcher<Paginate<Country>>(
        buildUrlQueryParams("v1/rest/countries", { has_price: true, country_id: cookieCountryId })
      );
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      countries = { data: [] };
    }

    defaultCountry = countries?.data?.[0] || null;
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    // Provide fallback values
    languages = { data: [] };
    currencies = { data: [] };
    parsedSettings = { ui_type: "1", title: "Kadin App" };
    defaultCountry = null;
    defaultLanguage = { locale: "en", backward: false };
  }

  const selectedLocale = cookies().get("lang")?.value;
  const selectedDirection = cookies().get("dir")?.value;

  const css = `
    :root {
       --primary: ${parsedSettings?.ui_type === "4" ? "#FE7200" : "#E34F26"} 
    }
`;

  return (
    <html
      lang={selectedLocale || defaultLanguage?.locale || "en"}
      dir={selectedDirection || (defaultLanguage?.backward ? "rtl" : "ltr")}
    >
      <head>
        <style>{css}</style>
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
          languages={languages?.data}
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
