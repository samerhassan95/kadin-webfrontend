import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import React from "react";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { Header } from "./components/header";

const PushNotification = dynamic(() =>
  import("@/components/push-notification").then((component) => ({
    default: component.PushNotification,
  }))
);

const StoreLayout = async ({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) => {
  let settings;
  try {
    const settingsResponse = await fetcher<DefaultResponse<Setting[]>>("settings-test", {
      cache: "no-cache",
    });
    settings = settingsResponse?.data;
  } catch (error) {
    console.log("Failed to load settings, using defaults");
    settings = [
      { key: 'title', value: 'Kadin Marketplace' },
      { key: 'currency_id', value: '1' },
      { key: 'system_lang', value: 'en' }
    ];
  }
  
  const isAuthenticated = cookies().has("token");
  return (
    <>
      <Header settings={settings} />
      {detail}
      {children}
      {isAuthenticated && <PushNotification />}
    </>
  );
};

export default StoreLayout;
