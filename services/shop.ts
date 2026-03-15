import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { CreateShopCredentials, Shop } from "@/types/shop";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const shopService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Shop>>(buildUrlQueryParams("v1/rest/shops/paginate", finalParams));
  },
  create: (data: CreateShopCredentials) => fetcher.post("v1/dashboard/user/shops", { body: data }),
};
