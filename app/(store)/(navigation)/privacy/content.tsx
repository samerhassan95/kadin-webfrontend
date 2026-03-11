"use client";

import { DefaultResponse, Term } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { infoService } from "@/services/info";
import SafeHtmlRenderer from "@/components/safe-html-renderer/safe-html-renderer";

interface PrivacyContentProps {
  data?: DefaultResponse<Term>;
}

export const PrivacyContent = ({ data }: PrivacyContentProps) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  
  const { data: privacy } = useQuery(
    ["privacy", language?.locale],
    () => infoService.privacy({ lang: language?.locale }),
    {
      initialData: data,
    }
  );

  return (
    <div className="xl:container px-2 md:px-4">
      <h1 className="md:text-[26px] text-xl font-semibold">{privacy?.data?.translation?.title}</h1>
      <SafeHtmlRenderer 
        html={privacy?.data?.translation?.description || ""} 
        className="mt-4"
      />
    </div>
  );
};
