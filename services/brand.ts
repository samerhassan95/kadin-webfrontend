import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Brand } from "@/types/brand";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const brandService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Brand>>(buildUrlQueryParams("v1/rest/brands/paginate", finalParams));
  },
};
