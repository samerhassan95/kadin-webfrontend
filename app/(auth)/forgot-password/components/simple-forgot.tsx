"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import Link from "next/link";

const schema = yup.object({
  email: yup.string().email().required(),
});

type FormType = yup.InferType<typeof schema>;

const SimpleForgotPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { mutate: forgotPassword } = useMutation({
    mutationFn: (body: { email: string }) => authService.forgotPasswordEmail(body),
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

  const handleForgotPassword = (data: FormType) => {
    setIsLoading(true);
    forgotPassword(data, {
      onSuccess: () => {
        success("Password reset email sent successfully");
        setEmailSent(true);
        setIsLoading(false);
      },
    });
  };

  if (emailSent) {
    return (
      <div className="flex flex-col gap-6 lg:px-10 md:px-6 sm:px-4 px-2 pt-8 pb-10">
        <h1 className="font-semibold text-[30px] mb-2 text-start">{t("check.your.email")}</h1>
        <p className="text-gray-600 mb-4">
          We've sent a password reset link to your email address. Please check your email and follow the instructions to reset your password.
        </p>
        <Link href="/login" className="text-center">
          <Button fullWidth>
            {t("back.to.login")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:px-10 md:px-6 sm:px-4 px-2 pt-8 pb-10">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("forgot.password")}</h1>
      <p className="text-gray-600 mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit(handleForgotPassword)}>
        <div className="flex flex-col gap-3 mb-3 w-full">
          <Input
            {...register("email")}
            error={errors.email?.message}
            fullWidth
            label={t("email")}
            type="email"
          />
        </div>
        <Button loading={isLoading} fullWidth>
          {t("send.reset.link")}
        </Button>
      </form>
      <Link href="/login" className="font-medium text-center">
        {t("back.to.login")}
      </Link>
    </div>
  );
};

export default SimpleForgotPassword;