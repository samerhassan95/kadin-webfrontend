export interface Reel {
  id: number;
  video_url: string;
  description?: string;
  is_liked: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  shop: {
    id: number;
    uuid: string;
    user_id: number;
    tax: number;
    delivery_range: number;
    percentage: number;
    phone?: string;
    show_type: boolean;
    open: boolean;
    visibility: boolean;
    open_time?: string;
    close_time?: string;
    background_img?: string;
    logo_img?: string;
    min_amount: number;
    status: string;
    status_note?: string;
    rating_avg: number;
    created_at: string;
    updated_at: string;
    translation?: {
      id: number;
      locale: string;
      title: string;
      description?: string;
    };
  };
  product?: {
    id: number;
    uuid: string;
    shop_id: number;
    category_id: number;
    price: number;
    img?: string;
    stock: number;
    active: boolean;
    translation?: {
      id: number;
      locale: string;
      title: string;
      description?: string;
    };
  } | null;
}