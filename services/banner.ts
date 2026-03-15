import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { Banner } from "@/types/banner";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const bannerService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Banner>>(buildUrlQueryParams("v1/rest/banners/paginate", finalParams));
  },
  get: (id: number, params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<Banner>>(
      buildUrlQueryParams(`v1/rest/banners/${id}`, finalParams)
    );
  },
};
