import {
  SignInCredentials,
  SignInResponse,
  SignUpCredentials,
  SocialLoginCredentials,
} from "@/types/user";
import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const authService = {
  socialLogin: async (body: SocialLoginCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>(
      buildUrlQueryParams(`v1/auth/${body.type}/callback`, body.data)
    ),
  login: async (body: SignInCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/login", { body }),
  register: async (body: SignUpCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/register", { body }),
  signUpComplete: async (body: SignUpCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/after-verify", { body }),
  phoneSignUpComplete: async (body: SignUpCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/verify/phone", { body }),
  forgotPasswordEmail: async (body: { email: string }) =>
    fetcher.post<DefaultResponse<any>>("v1/auth/forgot/email-password", { body }),
  forgotPasswordVerifyEmail: async (hash: string, body: { email: string }) =>
    fetcher.post<DefaultResponse<SignInResponse>>(`v1/auth/forgot/password/email/verify/${hash}`, { body }),
  forgotPasswordPhone: async (body: { phone?: string; type: string; id?: string }) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/forgot/password/confirm", { body }),
  logout: (data: { token: string }) => fetcher.post("v1/auth/logout", { body: data }),
};
