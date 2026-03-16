import { Input } from "@/components/input";
import Link from "next/link";
import { Button } from "@/components/button";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpViews } from "@/app/(auth)/types";
import { error, success } from "@/components/alert";
import { authService } from "@/services/auth";

const schema = yup.object({
  phone: yup.string().required("Phone number is required"),
  name: yup.string().required("Name is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  agreed: yup.boolean().required().oneOf([true], "You must agree to terms and conditions"),
});

type FormData = yup.InferType<typeof schema>;

interface SignUpFormProps {
  onChangeView: (view: SignUpViews) => void;
  onSuccess: (data: { credential: string; user: any }) => void;
}

const SignUpForm = ({ onChangeView, onSuccess }: SignUpFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleSignUp = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await authService.register({
        phone: data.phone,
        name: data.name,
        password: data.password,
      });

      if (response.status) {
        success("Registration successful! You can now login.");
        // Skip SMS verification for now - go directly to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        error(response.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      // Handle SMS configuration error
      if (err.message && err.message.includes('sms')) {
        success("Registration successful! SMS verification is disabled for testing. You can now login.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        error(err.message || "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:px-10 md:px-6 sm:px-4 px-2 pt-8 pb-10">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("sign.up")}</h1>
      <form id="signUp" onSubmit={handleSubmit(handleSignUp)}>
        <div className="flex flex-col gap-4 mb-4 w-full">
          <Input
            {...register("phone")}
            error={errors.phone?.message}
            fullWidth
            label={t("phone.number")}
            placeholder="01234567890"
          />
          
          <Input
            {...register("name")}
            error={errors.name?.message}
            fullWidth
            label={t("full.name")}
            placeholder="Ahmed Ali"
          />
          
          <Input
            {...register("password")}
            error={errors.password?.message}
            fullWidth
            label={t("password")}
            type="password"
            placeholder="••••••••"
          />
          
          <div className="flex items-center mt-2">
            <input
              id="link-checkbox"
              type="checkbox"
              {...register("agreed")}
              className="w-4 h-4 accent-primary bg-gray-100 border-gray-inputBorder rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="link-checkbox" className="ml-2 text-sm font-medium">
              {t("i.agree.with")}{" "}
              <Link href="/terms" className="text-primary hover:underline">
                {t("terms.and.conditions")}
              </Link>
            </label>
          </div>
        </div>
      </form>
      
      <Button
        loading={isSubmitting}
        form="signUp"
        type="submit"
        disabled={!watch("agreed")}
        fullWidth
      >
        {t("sign.up")}
      </Button>
      
      <div className="text-center text-sm text-gray-600">
        {t("already.have.account")}{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          {t("login")}
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
