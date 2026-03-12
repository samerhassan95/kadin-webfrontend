"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";

const SimpleForgotPassword = dynamic(() => import("./components/simple-forgot"), {
  loading: () => <LoadingCard />,
});

const ForgotPassword = () => {
  return <SimpleForgotPassword />;
};

export default ForgotPassword;
