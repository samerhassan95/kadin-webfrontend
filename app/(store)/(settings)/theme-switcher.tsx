"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/switch";
import { setCookie } from "cookies-next";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChangeTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    setCookie("theme", checked ? "dark" : "light");
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{t("theme")}</span>
      <Switch value={theme === "dark"} onText="dark" offText="light" onChange={handleChangeTheme} />
    </div>
  );
};

export default ThemeSwitcher;
