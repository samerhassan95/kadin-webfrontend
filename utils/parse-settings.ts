import { Setting } from "@/types/global";

export const parseSettings = (settings: Setting[] | null | undefined): Record<string, string> => {
  if (!settings || !Array.isArray(settings)) {
    return {};
  }
  return Object.assign({}, ...settings.map((setting) => ({ [setting.key]: setting.value })));
};
