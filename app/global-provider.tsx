"use client";

import useSettingsStore from "@/global-store/settings";
import { Country, Currency, Language } from "@/types/global";
import React, { useEffect } from "react";
import "@/lib/i18n";
import { setCookie, deleteCookie } from "cookies-next";
import { useTranslation } from "react-i18next";
import useAddressStore from "@/global-store/address";
import LanguageInitializer from "@/components/language-initializer";
import {
  saveLanguageSettings,
  loadLanguageSettings,
  syncI18nextStorage,
} from "@/utils/language-persistence";

interface GlobalProviderProps extends React.PropsWithChildren {
  languages?: Language[];
  currencies?: Currency[];
  settings?: Record<string, string>;
  defaultCountry?: Country;
}

const GlobalProvider = ({
  children,
  languages,
  currencies,
  settings,
  defaultCountry,
}: GlobalProviderProps) => {
  const { i18n } = useTranslation();
  const defaultCurrency = currencies?.find((currency) => currency.default);
  const defaultLanguage = languages?.find((lang) => Boolean(lang.default));
  const updateCountry = useAddressStore((state) => state.updateCountry);
  const selectedCountry = useAddressStore((state) => state.country);
  const {
    selectedCurrency,
    selectedLanguage,
    updateSelectedCurrency,
    updateSelectedLanguage,
    updateSettings,
    updateDefaultCurrency,
  } = useSettingsStore();

  useEffect(() => {
    if (settings) {
      const tempSettings = { ...settings };
      if (process.env.NEXT_PUBLIC_UI_TYPE) {
        tempSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
      }
      updateSettings(tempSettings);
    }

    // Initialize language from localStorage first, then fallback to server data
    let preferredLanguage = defaultLanguage;
    let shouldUpdateLanguage = false;

    if (typeof window !== "undefined") {
      const storedSettings = loadLanguageSettings();

      console.log(
        `GlobalProvider: storedSettings=${JSON.stringify(storedSettings)}, defaultLanguage=${
          defaultLanguage?.locale
        }`
      );

      if (storedSettings && languages) {
        const storedLanguage = languages.find((lang) => lang.locale === storedSettings.locale);
        if (storedLanguage) {
          preferredLanguage = storedLanguage;
          shouldUpdateLanguage = true;

          console.log(`GlobalProvider: Using stored language ${storedSettings.locale}`);

          // Immediately apply settings to prevent flash and ensure DOM is updated
          saveLanguageSettings(storedSettings);
          syncI18nextStorage(storedSettings.locale);
        }
      }
    }

    const newSelectedCurrency = currencies?.find(
      (currency) => currency.id === selectedCurrency?.id
    );
    if (newSelectedCurrency) {
      updateSelectedCurrency(newSelectedCurrency);
    } else if (defaultCurrency) {
      updateSelectedCurrency(defaultCurrency);
    }
    if (defaultCurrency) {
      updateDefaultCurrency(defaultCurrency);
    }

    // Use stored language if we found one, otherwise use selected or default
    const newSelectedLanguage = languages?.find((language) => language.id === selectedLanguage?.id);
    const language = shouldUpdateLanguage
      ? preferredLanguage
      : newSelectedLanguage || preferredLanguage;
    const currency = newSelectedCurrency || defaultCurrency;

    if (language) {
      console.log(`GlobalProvider: Setting up language ${language.locale}`);

      // Always ensure i18n is set to the correct language
      if (i18n.language !== language.locale) {
        console.log(
          `GlobalProvider: Changing i18n language from ${i18n.language} to ${language.locale}`
        );
        i18n.changeLanguage(language.locale);
      }

      // Save language settings using utility (this also syncs i18nextLng)
      saveLanguageSettings({
        locale: language.locale,
        direction: language.backward ? "rtl" : "ltr",
      });

      // Additional sync to ensure i18nextLng is updated
      syncI18nextStorage(language.locale);

      // Only set lang cookie for English (backend doesn't support Arabic yet)
      if (language.locale === "en") {
        setCookie("lang", language.locale);
      } else {
        // Remove lang cookie for Arabic to prevent backend errors
        deleteCookie("lang");
      }

      setCookie("dir", language.backward ? "rtl" : "ltr");
      setCookie("currency_id", currency?.id);

      updateSelectedLanguage(language);
    }

    if (!selectedCountry && defaultCountry) {
      updateCountry(defaultCountry);
      setCookie("country_id", defaultCountry.id);
    }
  }, [languages, currencies, defaultCurrency, defaultCountry]); // Removed i18n, defaultLanguage and selectedLanguage from deps to prevent loops

  return (
    <>
      <LanguageInitializer />
      {children}
    </>
  );
};

export default GlobalProvider;
