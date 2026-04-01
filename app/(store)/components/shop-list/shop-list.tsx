import { ShopCard } from "@/components/shop-card";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";

const ShopList = () => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, error, isLoading } = useInfiniteQuery({
    queryKey: ["shops", "has_reels"],
    queryFn: ({ pageParam }) =>
      shopService.getAll({
        page: pageParam || 1,
        has_reels: 1,
      }),
    suspense: false,
    getNextPageParam: (lastPage) => lastPage.links?.next && lastPage.meta?.current_page + 1,
  });

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-7 gap-4 animate-pulse my-7">
        {Array.from(Array(6).keys()).map((item) => (
          <div key={item} className="aspect-[450/260] bg-gray-300 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading shops: {error.message}
      </div>
    );
  }

  const shopList = extractDataFromPagination(data?.pages);
  
  if (!shopList || shopList.length === 0) {
    return <Empty text="No shops with reels found" />;
  }
  
  return (
    <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-7 gap-4 mt-4">
        {shopList.map((shop) => (
          <ShopCard data={shop} key={shop.id} />
        ))}
      </div>
    </InfiniteLoader>
  );
};

export default ShopList;
