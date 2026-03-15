"use client";

import React from "react";
import { ImageWithFallBack } from "@/components/image";
import { Ad } from "@/types/ads";

interface BannerCardProps {
  data: Ad;
  onClick: (ad: Ad) => void;
}

export const BannerCardHorizontal = ({ data, onClick }: BannerCardProps) => (
  <button
    onClick={() => onClick(data)}
    className="relative rounded-3xl overflow-hidden w-full  aspect-[2/1]"
  >
    {data.galleries?.[0]?.preview || data.galleries?.[0]?.path ? (
      <ImageWithFallBack
        src={data.galleries[0]?.preview || data.galleries[0]?.path}
        alt={data.translation?.title || "banner"}
        fill
        className="object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No Banner</span>
      </div>
    )}
    <div className="absolute left-5 bottom-6 flex flex-col gap-2 items-start">
      <strong className="font-extrabold lg:text-5xl text-2xl text-white text-start">
        {data?.translation?.title}
      </strong>
      <span className="text-base font-semibold text-white line-clamp-1">
        {data.translation?.description}
      </span>
    </div>
  </button>
);
