import { DefaultResponse, Paginate, ParamsType, Term } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Faq } from "@/types/info";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const infoService = {
  terms: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<Term>>(buildUrlQueryParams("v1/rest/term", finalParams), {
      redirectOnError: true,
      cache: "no-cache",
    });
  },

  privacy: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<Term>>(buildUrlQueryParams("v1/rest/policy", finalParams), {
      redirectOnError: true,
    });
  },
  faq: (params: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Faq>>(buildUrlQueryParams("v1/rest/faqs/paginate", finalParams), {
      cache: "no-cache",
    });
  },
};
