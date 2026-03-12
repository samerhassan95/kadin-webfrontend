"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";

const SimpleSignUp = dynamic(() => import("./components/simple-signup"), {
  loading: () => <LoadingCard />,
});

const SignUp = () => {
  return <SimpleSignUp />;
};

export default SignUp;
