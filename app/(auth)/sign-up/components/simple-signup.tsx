"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignUpCredentials } from "@/types/user";
import { authService } from "@/services/auth";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import { setCookie } from "cookies-next";
import { userService } from "@/services/user";
import { useFcmToken } from "@/hook/use-fcm-token";
import useUserStore from "@/global-store/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useSyncServer } from "@/hook/use-sync-server";

const schema = yup.object({
  name: yup.string().required(),
  phone: yup.string().required(),
  password: yup.string().min(6).required(),
});

type FormType = yup.InferType<typeof schema>;

const SimpleSignUp = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { handleSync } = useSyncServer();
  const [isLoading, setIsLoading] = useState(false);
  const { fcmToken } = useFcmToken();
  const localSignIn = useUserStore((state) => state.signIn);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: signUp } = useMutation({
    mutationFn: (body: SignUpCredentials) => authService.register(body),
    onError: (err: NetworkError) => {
      error(err.message);
      setIsLoading(false);
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });

  const handleSignUp = (data: FormType) => {
    setIsLoading(true);
    const body: SignUpCredentials = {
      firstname: data.name,
      phone: data.phone.replace(/[^0-9]/g, ""),
      password: data.password,
      password_confirmation: data.password,
    };

    signUp(body, {
      onSuccess: (res) => {
        success("successfully.registered");
        setCookie("token", `${res.data.token_type} ${res.data.access_token}`);
        if (fcmToken) {
          userService.updateFirebaseToken({ firebase_token: fcmToken });
        }
        localSignIn(res.data.user);
        handleSync();
        if (searchParams.has("redirect")) {
          router.replace(searchParams.get("redirect") as string);
        } else {
          router.replace("/");
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 lg:px-10 md:px-6 sm:px-4 px-2 pt-8 pb-6">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("sign.up")}</h1>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div className="flex flex-col gap-3 mb-3 w-full">
          <Input
            {...register("phone")}
            error={errors.phone?.message}
            fullWidth
            label={t("phone")}
            type="tel"
          />
          <Input
            {...register("name")}
            error={errors.name?.message}
            fullWidth
            label={t("name")}
          />
          <Input
            {...register("password")}
            error={errors.password?.message}
            fullWidth
            label={t("password")}
            type="password"
          />
        </div>
        <Button loading={isLoading} disabled={Boolean(queryClient.isMutating())} fullWidth>
          {t("sign.up")}
        </Button>
      </form>
    </div>
  );
};

export default SimpleSignUp;