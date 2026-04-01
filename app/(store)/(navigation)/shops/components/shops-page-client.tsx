"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { DefaultResponse, Paginate } from '@/types/global';
import { Shop } from '@/types/shop';
import { request } from '@/lib/fetcher';
import { LoadingCard } from '@/components/loading';
import { ShopCard } from '@/components/shop-card';
import { SearchField } from '@/components/search-field';
import { InfiniteLoader } from '@/components/infinite-loader';

interface ShopsPageClientProps {
  initialData: Paginate<Shop> | null;
}

export const ShopsPageClient: React.FC<ShopsPageClientProps> = ({ initialData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);

  const { data: shopsData, isLoading, error } = useQuery({
    queryKey: ['shops', page, searchValue],
    queryFn: async () => {
      console.log('🏪 Fetching shops with params:', {
        page,
        search: searchValue,
        perPage: 12,
        has_reels: 1
      });
      
      const result = await request<Paginate<Shop>>({
        url: 'v1/rest/shops/paginate',
        params: {
          page,
          search: searchValue,
          perPage: 12,
          has_reels: 1 // Only show shops that have reels
        },
      });
      
      console.log('🏪 Shops API response:', result);
      return result;
    },
    initialData: page === 1 && !searchValue ? initialData : undefined,
  });

  const shops = shopsData?.data || [];
  const hasNextPage = shopsData?.links?.next != null;

  // Debug logging
  console.log('🏪 Shops data structure:', {
    shopsData,
    shops,
    hasNextPage,
    error,
    isLoading
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/shops?${params.toString()}`);
  };

  const loadMore = () => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="xl:container px-2 md:px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('shops')}</h1>
          <div className="text-red-500 mb-4">
            {t('Error loading shops. Please try again.')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:container px-2 md:px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{t('shops')}</h1>
        <p className="text-gray-600 mb-4">
          {t('Discover shops and watch their latest reels')}
        </p>
        
        <SearchField
          value={searchValue}
          onChange={handleSearch}
          placeholder={t('Search shops...')}
          className="max-w-md"
        />
      </div>

      {isLoading && page === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : shops.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} data={shop} />
            ))}
          </div>
          
          {hasNextPage && (
            <InfiniteLoader loadMore={loadMore} hasMore={hasNextPage} />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchValue ? t('No shops found') : t('No shops available')}
          </h3>
          <p className="text-gray-500">
            {searchValue 
              ? t('Try adjusting your search terms') 
              : t('Check back later for new shops with reels')
            }
          </p>
        </div>
      )}
    </div>
  );
};