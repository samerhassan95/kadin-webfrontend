"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  loadLanguageSettings,
  saveLanguageSettings,
  syncI18nextStorage,
} from "@/utils/language-persistence";

const LanguageInitializer = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Ensure language is properly initialized from localStorage
    if (typeof window !== "undefined") {
      const storedSettings = loadLanguageSettings();

      console.log(
        `LanguageInitializer: storedSettings=${JSON.stringify(storedSettings)}, i18n.language=${
          i18n.language
        }`
      );

      if (storedSettings) {
        // Always apply stored settings to ensure consistency
        saveLanguageSettings(storedSettings);
        syncI18nextStorage(storedSettings.locale);

        // If i18n language is different from stored, update i18n
        if (storedSettings.locale !== i18n.language) {
          console.log(
            `LanguageInitializer: Restoring language from localStorage: ${storedSettings.locale} (was ${i18n.language})`
          );
          i18n.changeLanguage(storedSettings.locale);
        }
      } else {
        // If no stored settings, save current i18n language to localStorage
        const currentLang = i18n.language || "en";
        const direction = currentLang === "ar" ? "rtl" : "ltr";

        console.log(
          `LanguageInitializer: No stored settings, saving current language: ${currentLang}`
        );
        saveLanguageSettings({
          locale: currentLang,
          direction: direction as "ltr" | "rtl",
        });

        syncI18nextStorage(currentLang);
      }
    }
  }, []); // Remove i18n dependency to prevent loops

  // Also listen for i18n ready state
  useEffect(() => {
    const handleI18nInitialized = () => {
      if (i18n.isInitialized) {
        console.log(`LanguageInitializer: i18n initialized with language: ${i18n.language}`);

        // Ensure localStorage is synced with i18n state
        const storedLang = localStorage.getItem("lang");
        const i18nextLng = localStorage.getItem("i18nextLng");

        if (storedLang !== i18n.language || i18nextLng !== i18n.language) {
          console.log(
            `LanguageInitializer: Syncing localStorage with i18n language: ${i18n.language}`
          );
          syncI18nextStorage(i18n.language);
        }
      }
    };

    if (i18n.isInitialized) {
      handleI18nInitialized();
    } else {
      i18n.on("initialized", handleI18nInitialized);
      return () => i18n.off("initialized", handleI18nInitialized);
    }
  }, [i18n]);

  return null; // This component doesn't render anything
};

export default LanguageInitializer;
