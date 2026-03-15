import fetcher from "@/lib/fetcher";
import { LikeOptions, Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Product } from "@/types/product";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const likeService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Product>>(buildUrlQueryParams("v1/dashboard/likes", finalParams));
  },
  like: (body: LikeOptions) => fetcher.post("v1/dashboard/likes", { body }),
  dislike: (options: LikeOptions) =>
    fetcher.delete(`v1/dashboard/likes/${options.type_id}?type=${options.type}`),
  likeMany: (body: { types: LikeOptions[] }) =>
    fetcher.post("v1/dashboard/like/store-many", { body }),
};
