import { DefaultResponse, Paginate } from '@/types/global';
import { Reel } from '@/types/reel';
import { request } from '@/lib/fetcher';

export const reelsService = {
  // Get reels for a specific shop
  getShopReels: (params: { shop_id: number; page?: number; perPage?: number }) =>
    request<DefaultResponse<Paginate<Reel>>>({
      url: 'v1/rest/reels/paginate',
      params,
    }),

  // Get all public reels
  getPublicReels: (params?: { page?: number; perPage?: number; shop_id?: number }) =>
    request<DefaultResponse<Paginate<Reel>>>({
      url: 'v1/rest/reels/paginate',
      params,
    }),

  // Like/unlike a reel
  likeReel: (id: number) =>
    request<DefaultResponse<{ liked: boolean; likes_count: number }>>({
      url: `v1/rest/reels/${id}/like`,
      method: 'POST',
    }),

  // Get reel by ID
  getById: (id: number) =>
    request<DefaultResponse<Reel>>({
      url: `v1/rest/reels/${id}`,
    }),
};