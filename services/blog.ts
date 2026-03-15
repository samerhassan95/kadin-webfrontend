import fetcher from "@/lib/fetcher";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { Blog, BlogFullTranslation, BlogShortTranslation } from "@/types/blog";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const blogService = {
  getAll: (params?: ParamsType, init?: RequestInit) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Blog<BlogShortTranslation>>>(
      buildUrlQueryParams("v1/rest/blogs/paginate", finalParams),
      init
    );
  },
  get: (id: string, params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<Blog<BlogFullTranslation>>>(
      buildUrlQueryParams(`v1/rest/blog-by-id/${id}`, finalParams),
      { redirectOnError: true }
    );
  },
};
