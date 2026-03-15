import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { DigitalProduct, Filter, Product, ProductFull, SearchProduct } from "@/types/product";
import { BASE_URL } from "@/config/global";
import { getCookie } from "cookies-next";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const productService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Product>>(
      buildUrlQueryParams("v1/rest/products/paginate", finalParams)
    );
  },
  getByIds: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Product>>(buildUrlQueryParams("v1/rest/products/ids", finalParams));
  },
  filters: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Filter>(buildUrlQueryParams("v1/rest/filter", finalParams));
  },
  search: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<SearchProduct>>(
      buildUrlQueryParams("v1/rest/products/search", finalParams)
    );
  },
  get: (id?: string, params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<ProductFull>>(
      buildUrlQueryParams(`v1/rest/products/${id}`, finalParams)
    );
  },
  getViewHistory: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Product>>(
      buildUrlQueryParams("v1/rest/product-histories/paginate", finalParams)
    );
  },
  alsoBought: (params?: ParamsType, id?: number | string) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Product>>(
      buildUrlQueryParams(`v1/rest/products/${id}/also-bought`, finalParams)
    );
  },
  compare: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<ProductFull[][]>>(
      buildUrlQueryParams("v1/rest/compare", finalParams)
    );
  },
  myDigitalFiles: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<DigitalProduct>>(
      buildUrlQueryParams("v1/dashboard/user/my-digital-files", finalParams)
    );
  },
  downloadFile: (id: number) =>
    fetch(`${BASE_URL}v1/dashboard/user/digital-files/${id}`, {
      headers: {
        "Content-Type": "application/zip",
        Authorization: getCookie("token") as string,
      },
    }),
};
