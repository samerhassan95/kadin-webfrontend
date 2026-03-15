"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/switch";
import { setCookie, deleteCookie } from "cookies-next";
import useSettingsStore from "@/global-store/settings";
import { userService } from "@/services/user";
import useUserStore from "@/global-store/user";
import { saveLanguageSettings, syncI18nextStorage } from "@/utils/language-persistence";

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { i18n, t } = useTranslation();
  const { updateSelectedLanguage } = useSettingsStore();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChangeLanguage = (checked: boolean) => {
    const newLanguage = checked ? "ar" : "en";
    const isRTL = newLanguage === "ar";
    const direction = isRTL ? "rtl" : "ltr";

    // Update i18n first
    i18n.changeLanguage(newLanguage);

    // Save to localStorage and update DOM using utility (this also syncs i18nextLng)
    saveLanguageSettings({
      locale: newLanguage,
      direction: direction as "ltr" | "rtl",
    });

    // Additional sync to ensure i18nextLng is updated
    syncI18nextStorage(newLanguage);

    // Persist to cookies
    // For Arabic, we DON'T set the lang cookie to avoid backend errors
    // The backend doesn't support "ar" yet, so we only store it locally
    if (newLanguage === "en") {
      setCookie("lang", newLanguage, { maxAge: 365 * 24 * 60 * 60 });
    } else {
      // Remove lang cookie for Arabic to prevent backend errors
      deleteCookie("lang");
    }

    setCookie("dir", direction, { maxAge: 365 * 24 * 60 * 60 });

    // Update global state
    const mockLanguage = {
      id: newLanguage === "ar" ? 2 : 1,
      locale: newLanguage,
      backward: isRTL,
      title: newLanguage === "ar" ? "العربية" : "English",
      default: newLanguage === "en" ? 1 : 0,
    };
    updateSelectedLanguage(mockLanguage);

    // Update language on server - send actual language but handle errors gracefully
    if (user) {
      userService
        .updateLanguage(newLanguage)
        .then(() => {
          console.log("Language updated on server:", newLanguage);
        })
        .catch((error) => {
          // Handle 422 errors (unsupported language) gracefully
          if (error.status === 422) {
            console.warn(
              `Backend doesn't support language '${newLanguage}', keeping local setting only`
            );
          } else {
            console.warn("Failed to update language on server:", error);
          }
          // Don't show error to user as language change works locally
        });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{t("language")}</span>
      <Switch
        value={i18n.language === "ar"}
        onText="AR"
        offText="EN"
        onChange={handleChangeLanguage}
      />
    </div>
  );
};

export default LanguageSwitcher;
