import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Category } from "@/types/category";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const categoryService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Category>>(
      buildUrlQueryParams("v1/rest/categories/paginate", finalParams)
    );
  },
};
