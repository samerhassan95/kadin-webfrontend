/**
 * Test utility to verify language persistence functionality
 * This can be called from browser console to test the implementation
 */

import {
  saveLanguageSettings,
  loadLanguageSettings,
  syncI18nextStorage,
} from "./language-persistence";

export const testLanguagePersistence = () => {
  console.log("🧪 Testing Language Persistence...");

  // Test 1: Save Arabic settings
  console.log("📝 Test 1: Saving Arabic settings...");
  saveLanguageSettings({ locale: "ar", direction: "rtl" });

  const arabicSettings = loadLanguageSettings();
  console.log("📖 Loaded Arabic settings:", arabicSettings);

  // Check localStorage keys
  const langKey = localStorage.getItem("lang");
  const dirKey = localStorage.getItem("dir");
  const i18nextKey = localStorage.getItem("i18nextLng");

  console.log("🔍 localStorage keys after Arabic:", {
    lang: langKey,
    dir: dirKey,
    i18nextLng: i18nextKey,
  });

  // Check DOM attributes
  const htmlLang = document.documentElement.getAttribute("lang");
  const htmlDir = document.documentElement.getAttribute("dir");

  console.log("🌐 DOM attributes after Arabic:", { lang: htmlLang, dir: htmlDir });

  // Test 2: Save English settings
  console.log("📝 Test 2: Saving English settings...");
  saveLanguageSettings({ locale: "en", direction: "ltr" });

  const englishSettings = loadLanguageSettings();
  console.log("📖 Loaded English settings:", englishSettings);

  // Check localStorage keys again
  const langKey2 = localStorage.getItem("lang");
  const dirKey2 = localStorage.getItem("dir");
  const i18nextKey2 = localStorage.getItem("i18nextLng");

  console.log("🔍 localStorage keys after English:", {
    lang: langKey2,
    dir: dirKey2,
    i18nextLng: i18nextKey2,
  });

  // Check DOM attributes again
  const htmlLang2 = document.documentElement.getAttribute("lang");
  const htmlDir2 = document.documentElement.getAttribute("dir");

  console.log("🌐 DOM attributes after English:", { lang: htmlLang2, dir: htmlDir2 });

  // Test 3: Sync test
  console.log("📝 Test 3: Testing sync functionality...");
  localStorage.setItem("lang", "ar");
  syncI18nextStorage("ar");

  const syncedI18next = localStorage.getItem("i18nextLng");
  console.log("🔄 After sync - i18nextLng:", syncedI18next);

  // Test 4: Simulate i18nextLng being set by i18next
  console.log("📝 Test 4: Simulating i18nextLng update...");
  localStorage.setItem("i18nextLng", "ar");
  const reloadedSettings = loadLanguageSettings();
  console.log("📖 Settings after i18nextLng update:", reloadedSettings);

  const finalLang = localStorage.getItem("lang");
  const finalI18next = localStorage.getItem("i18nextLng");
  console.log("🔄 Final sync check:", {
    lang: finalLang,
    i18nextLng: finalI18next,
    synced: finalLang === finalI18next,
  });

  console.log("✅ Language persistence tests completed!");

  return {
    arabicTest: arabicSettings,
    englishTest: englishSettings,
    syncTest: syncedI18next === "ar",
    finalSyncTest: finalLang === finalI18next,
  };
};

// Make it available globally for console testing
if (typeof window !== "undefined") {
  (window as any).testLanguagePersistence = testLanguagePersistence;
}
