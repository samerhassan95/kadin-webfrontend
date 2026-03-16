import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import { CountrySelectForm } from "./country-select-form";

const CountrySelectPage = async () => {
  // Use default settings instead of API call to avoid database connection
  const defaultSettings = {
    data: [
      { key: 'title', value: 'Kadin Marketplace' },
      { key: 'currency_id', value: '1' },
      { key: 'system_lang', value: 'en' }
    ]
  };
  const parsedSettings = parseSettings(defaultSettings?.data);
  return <CountrySelectForm settings={parsedSettings} />;
};

export default CountrySelectPage;
