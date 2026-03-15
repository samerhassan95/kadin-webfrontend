/**
 * Get the language code from localStorage only if it's supported by the backend.
 * Currently, the backend only supports "en" (English).
 * Arabic ("ar") is handled client-side only for UI translations.
 *
 * @returns The language code if supported by backend, null otherwise
 */
export const getSupportedLang = (): string | null => {
  if (typeof window === "undefined") return null;

  const lang = localStorage.getItem("lang");

  // Only return lang if it's supported by the backend
  // Currently only "en" is supported
  return lang === "en" ? lang : null;
};
