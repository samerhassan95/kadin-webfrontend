import { Blog, BlogFullTranslation } from "@/types/blog";
import dayjs from "dayjs";
import Image from "next/image";
import SafeHtmlRenderer from "@/components/safe-html-renderer/safe-html-renderer";

export const NewsContent = ({ data }: { data?: Blog<BlogFullTranslation> }) => {
  return (
    <div className="py-10 px-8">
      <span className="text-sm text-gray-disabledTab">
        {dayjs(data?.published_at).format("DD MMM, YY HH:mm")}
      </span>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-[22px] font-semibold mt-4 mb-1">{data?.translation?.title}</div>
        {!!data?.img && (
          <div className="relative w-full aspect-[3/1] rounded-2xl overflow-hidden">
            <Image
              src={data?.img}
              alt={data?.translation?.title || "(.)news"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <SafeHtmlRenderer 
          html={data?.translation?.description || ""} 
          className="text-base leading-7"
        />
      </div>
    </div>
  );
};
