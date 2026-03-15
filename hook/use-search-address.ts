import { useMutation } from "@tanstack/react-query";
import { Coordinate } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import useSettingsStore from "@/global-store/settings";

export const useSearchAddress = () => {
  const settings = useSettingsStore((state) => state.settings);
  return useMutation({
    mutationFn: async (location?: Partial<Coordinate>) => {
      const googleKey = settings?.google_map_key || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
      
      const params = {
        latlng: `${location?.lat},${location?.lng}`,
        lang: "en",
        key: googleKey,
      };
      
      return fetch(
        buildUrlQueryParams("https://maps.googleapis.com/maps/api/geocode/json", params)
      ).then((res) => res.json());
    },
  });
};
