import fetcher from "@/lib/fetcher";
import { Currency, DefaultResponse, Language } from "@/types/global";
import React from "react";
import SettingsForm from "./settings-form";

const Settings = async () => {
  const languages = await fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", {
    cache: "no-cache",
  });
  const currencies = await fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active", {
    cache: "no-cache",
  });

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

  return (
    <div className="flex-1">
      <div className="xl:w-4/5 w-full">
        <div className="grid md:grid-cols-2 gap-24">
          <div className="flex flex-col gap-4">
            <SettingsForm languages={enhancedLanguages} currencies={currencies?.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
