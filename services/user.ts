import fetcher from "@/lib/fetcher";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import {
  NotificationUpdateBody,
  PasswordUpdateBody,
  SearchedUser,
  Transaction,
  UpdateProfileBody,
  UserDetail,
} from "@/types/user";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { getSupportedLang } from "@/utils/get-supported-lang";

export const userService = {
  profile: () => fetcher<DefaultResponse<UserDetail>>("v1/dashboard/user/profile/show"),
  updateFirebaseToken: (data: { firebase_token: string }) =>
    fetcher.post(`v1/dashboard/user/profile/firebase/token/update`, { body: data }),
  update: (data: UpdateProfileBody) =>
    fetcher.put("v1/dashboard/user/profile/update", { body: data }),
  updatePassword: (data: PasswordUpdateBody) =>
    fetcher.post("v1/dashboard/user/profile/password/update", { body: data }),
  updateNotificationSettings: (body: NotificationUpdateBody) =>
    fetcher.post(`v1/dashboard/user/update/notifications`, { body }),
  getWalletHistory: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<Transaction>>(
      buildUrlQueryParams("v1/dashboard/user/wallet/histories", finalParams)
    );
  },
  userList: (params?: ParamsType) => {
    const lang = getSupportedLang();
    const finalParams = lang ? { lang, ...params } : params;
    return fetcher<Paginate<SearchedUser>>(
      buildUrlQueryParams("v1/dashboard/user/search-sending", finalParams)
    );
  },
  sendMoney: (data: { price: number; uuid: string }) =>
    fetcher.post("v1/dashboard/user/wallet/send", { body: data }),
  updateLanguage: (lang: string) =>
    // Send the actual language selected by the user to the backend
    fetcher.put(buildUrlQueryParams("v1/dashboard/user/profile/lang/update", { lang })),
  updateCurrency: (currencyId: number) =>
    fetcher.put(
      buildUrlQueryParams("v1/dashboard/user/profile/currency/update", { currency_id: currencyId })
    ),
};
