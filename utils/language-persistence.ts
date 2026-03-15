/**
 * Utility functions for persisting language and direction settings
 */

export interface LanguageSettings {
  locale: string;
  direction: "ltr" | "rtl";
}

/**
 * Save language settings to localStorage and update DOM
 */
export const saveLanguageSettings = (settings: LanguageSettings): void => {
  if (typeof window === "undefined") return;

  try {
    // Update our custom localStorage keys
    localStorage.setItem("lang", settings.locale);
    localStorage.setItem("dir", settings.direction);

    // Also update i18next's localStorage key to keep them in sync
    localStorage.setItem("i18nextLng", settings.locale);

    // Update DOM attributes immediately
    document.documentElement.setAttribute("lang", settings.locale);
    document.documentElement.setAttribute("dir", settings.direction);

    console.log(
      `saveLanguageSettings: Saved ${settings.locale} (${settings.direction}) to localStorage`
    );
  } catch (error) {
    console.warn("Failed to save language settings:", error);
  }
};

/**
 * Load language settings from localStorage
 */
export const loadLanguageSettings = (): LanguageSettings | null => {
  if (typeof window === "undefined") return null;

  try {
    // Priority: i18nextLng > lang (since i18next manages its own storage)
    const i18nextLng = localStorage.getItem("i18nextLng");
    const lang = localStorage.getItem("lang");
    const direction = localStorage.getItem("dir");

    console.log(`loadLanguageSettings: lang=${lang}, dir=${direction}, i18nextLng=${i18nextLng}`);

    // Use i18nextLng as primary source, fallback to lang
    const locale = i18nextLng || lang;

    if (locale) {
      // Ensure both keys are synced
      if (lang !== locale) {
        localStorage.setItem("lang", locale);
        console.log(`loadLanguageSettings: Synced lang to ${locale}`);
      }
      if (i18nextLng !== locale) {
        localStorage.setItem("i18nextLng", locale);
        console.log(`loadLanguageSettings: Synced i18nextLng to ${locale}`);
      }

      // Determine direction if not stored
      const finalDirection = direction || (locale === "ar" ? "rtl" : "ltr");
      if (!direction) {
        localStorage.setItem("dir", finalDirection);
        console.log(`loadLanguageSettings: Set direction to ${finalDirection}`);
      }

      return {
        locale,
        direction: finalDirection as "ltr" | "rtl",
      };
    }
  } catch (error) {
    console.warn("Failed to load language settings:", error);
  }

  return null;
};

/**
 * Apply language settings to DOM immediately (for preventing flash)
 */
export const applyLanguageSettingsToDOM = (settings: LanguageSettings): void => {
  if (typeof window === "undefined") return;

  try {
    document.documentElement.setAttribute("lang", settings.locale);
    document.documentElement.setAttribute("dir", settings.direction);
  } catch (error) {
    console.warn("Failed to apply language settings to DOM:", error);
  }
};

/**
 * Initialize language settings from localStorage on page load
 */
export const initializeLanguageFromStorage = (): LanguageSettings | null => {
  const settings = loadLanguageSettings();
  if (settings) {
    applyLanguageSettingsToDOM(settings);
  }
  return settings;
};

/**
 * Sync i18next localStorage with our custom keys
 */
export const syncI18nextStorage = (locale: string): void => {
  if (typeof window === "undefined") return;

  try {
    // Ensure both keys are in sync
    localStorage.setItem("lang", locale);
    localStorage.setItem("i18nextLng", locale);
    console.log(`syncI18nextStorage: Synced both keys to ${locale}`);
  } catch (error) {
    console.warn("Failed to sync i18next storage:", error);
  }
};
