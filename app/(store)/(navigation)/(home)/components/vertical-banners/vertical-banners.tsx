import { BannerCardVertical } from "@/components/banner-card-vertical";

export const VerticalBanners = () => {
  // Use static data to avoid server-side API calls
  const ads = { data: [] };
  
  return (
    <div className="flex flex-col gap-7 xl:col-span-1 col-span-6">
      {ads?.data?.map((banner) => (
        <BannerCardVertical
          id={banner.id}
          img={banner.galleries?.[0]?.preview || banner.galleries?.[0]?.path || ""}
          key={banner.id}
        />
      ))}
    </div>
  );
};
