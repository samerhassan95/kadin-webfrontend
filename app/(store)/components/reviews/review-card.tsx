import { Review } from "@/types/review";
import { ImageWithFallBack } from "@/components/image";
import dayjs from "dayjs";
import StarSmileIcon from "@/assets/icons/star-smile";
import { ProfilePlaceholder } from "../profile-placeholder";

export const ReviewCard = ({ data }: { data: Review }) => (
  <div className="pt-5 mb-6">
    <div className="flex items-center gap-2 mb-2.5">
      {data.user.img ? (
        <ImageWithFallBack
          src={data.user.img}
          alt={data.user?.firstname || "user"}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover"
        />
      ) : (
        <ProfilePlaceholder name={data.user?.firstname} size={44} />
      )}
      <div>
        <span className="text-base font-medium">
          {data.user.firstname} {data.user.lastname}
        </span>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-gray-field">
            {dayjs(data.created_at).format("DD.MM.YYYY")}
          </span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1">
            <span className="text-yellow">
              <StarSmileIcon size={16} />
            </span>
            <span className="text-xs font-medium">{data.rating}</span>
          </div>
        </div>
      </div>
    </div>
    <span className="text-base leading-7">{data.comment}</span>
    <div className="flex items-center gap-3 mb-2.5">
      {data.galleries?.map((img) => (
        img.path ? (
          <ImageWithFallBack
            key={img.id}
            src={img.path}
            alt={img.title || "product_img"}
            width={70}
            height={70}
            className="aspect-square object-contain"
          />
        ) : (
          <div key={img.id} className="w-[70px] h-[70px] bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )
      ))}
    </div>
  </div>
);
