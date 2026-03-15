import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Parcel, ParcelCreateBody } from "@/types/parcel";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const parcelService = {
  getTypes: (params: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher(buildUrlQueryParams("v1/rest/parcel-order/types", finalParams));
  },
  calculate: (params: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<{ price: number }>>(
      buildUrlQueryParams("v1/rest/parcel-order/calculate-price", finalParams)
    );
  },
  create: (body: ParcelCreateBody) =>
    fetcher.post<DefaultResponse<Parcel>>("v1/dashboard/user/parcel-orders", { body }),
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Parcel>>(
      buildUrlQueryParams("v1/dashboard/user/parcel-orders", finalParams)
    );
  },
  get: (id?: number | null, params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<DefaultResponse<Parcel>>(
      buildUrlQueryParams(`v1/dashboard/user/parcel-orders/${id}`, finalParams)
    );
  },
  cancel: (id?: number) =>
    fetcher.post(`v1/dashboard/user/parcel-orders/${id}/status/change?status=canceled`),
};
