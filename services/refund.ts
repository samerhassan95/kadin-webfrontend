import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Refund, RefundCreateBody } from "@/types/order";
import { getSupportedLang } from "@/utils/get-supported-lang";

const refundService = {
  getAll: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Refund>>(
      buildUrlQueryParams(`v1/dashboard/user/order-refunds/paginate`, finalParams)
    );
  },
  create: (body: RefundCreateBody) => fetcher.post(`v1/dashboard/user/order-refunds`, { body }),
};

export default refundService;
