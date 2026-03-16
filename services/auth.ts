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
  // New registration method without Firebase
  register: async (body: {
    phone: string;
    name: string;
    password: string;
  }) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/register", { body }),
    
  // New login method
  login: async (body: SignInCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/login", { body }),
    
  // Forgot password
  forgotPassword: async (body: { phone: string }) =>
    fetcher.post<DefaultResponse<any>>("v1/auth/forgot/password", { body }),
    
  // Confirm forgot password
  forgotPasswordConfirm: async (body: { phone: string; code: string; password: string }) =>
    fetcher.post<DefaultResponse<any>>("v1/auth/forgot/password/confirm", { body }),
    
  // Verify phone
  verifyPhone: async (body: { phone: string; code: string }) =>
    fetcher.post<DefaultResponse<any>>("v1/auth/verify/phone", { body }),
    
  // Resend verification code
  resendVerification: async (body: { phone: string }) =>
    fetcher.post<DefaultResponse<any>>("v1/auth/resend-verify", { body }),
    
  // Legacy methods (keep for compatibility)
  socialLogin: async (body: SocialLoginCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>(
      buildUrlQueryParams(`v1/auth/${body.type}/callback`, body.data)
    ),
  signUpComplete: async (body: SignUpCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/after-verify", { body }),
  phoneSignUpComplete: async (body: SignUpCredentials) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/verify/phone", { body }),
  forgotPasswordPhone: async (body: { phone?: string; type: string; id?: string }) =>
    fetcher.post<DefaultResponse<SignInResponse>>("v1/auth/forgot/password/confirm", { body }),
  logout: (data: { token: string }) => fetcher.post("v1/auth/logout", { body: data }),
};
