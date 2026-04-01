export interface Reel {
  id: number;
  shop_id: number;
  title: string;
  description?: string;
  video_url: string;
  is_active: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  shop?: {
    id: number;
    translation?: {
      title: string;
      description?: string;
    };
    logo_img?: string;
  };
}