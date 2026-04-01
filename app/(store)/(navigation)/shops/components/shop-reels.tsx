"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reelsService } from '@/services/reels';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { LoadingCard } from '@/components/loading';
import { useAuth } from '@/hook/use-auth';

interface ShopReelsProps {
  shopId: number;
}

export const ShopReels: React.FC<ShopReelsProps> = ({ shopId }) => {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set());
  const videoRefs = React.useRef<Map<number, HTMLVideoElement>>(new Map());

  const { data: reelsData, isLoading } = useQuery({
    queryKey: ['shop-reels', shopId],
    queryFn: () => reelsService.getShopReels({ shop_id: shopId }),
  });

  const reels = Array.isArray(reelsData?.data?.data) 
    ? reelsData.data.data 
    : Array.isArray(reelsData?.data) 
    ? reelsData.data 
    : [];

  // Initialize all videos as muted by default
  useEffect(() => {
    if (reels.length > 0) {
      setMutedVideos(new Set(reels.map(reel => reel.id)));
    }
  }, [reels]);

  // Handle video preview on hover
  useEffect(() => {
    videoRefs.current.forEach((video, reelId) => {
      if (hoveredVideo === reelId) {
        video.muted = true; // Always muted for preview
        video.currentTime = 0; // Start from beginning
        video.play().catch(console.error);
      } else {
        video.pause();
        video.currentTime = 0; // Reset to beginning
      }
    });
  }, [hoveredVideo]);

  const handleMouseEnter = (reelId: number) => {
    setHoveredVideo(reelId);
  };

  const handleMouseLeave = () => {
    setHoveredVideo(null);
  };

  const handleVideoClick = (reelId: number) => {
    const video = videoRefs.current.get(reelId);
    if (video) {
      if (video.paused) {
        video.muted = mutedVideos.has(reelId);
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }
  };

  const handleMuteToggle = (reelId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const video = videoRefs.current.get(reelId);
    if (video) {
      setMutedVideos(prev => {
        const newSet = new Set(prev);
        if (newSet.has(reelId)) {
          newSet.delete(reelId);
          video.muted = false;
        } else {
          newSet.add(reelId);
          video.muted = true;
        }
        return newSet;
      });
    }
  };

  const handleLike = async (reelId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isSignedIn) {
      alert('Please log in to like reels');
      return;
    }

    try {
      await reelsService.likeReel(reelId);
      setLikedReels(prev => {
        const newSet = new Set(prev);
        if (newSet.has(reelId)) {
          newSet.delete(reelId);
        } else {
          newSet.add(reelId);
        }
        return newSet;
      });
    } catch (error: any) {
      console.error('Error liking reel:', error);
      alert('Unable to like reel. Please try again.');
    }
  };

  const setVideoRef = useCallback((reelId: number) => (video: HTMLVideoElement | null) => {
    if (video) {
      videoRefs.current.set(reelId, video);
      // Set poster frame (first frame as thumbnail)
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0.1; // Show first frame as thumbnail
      });
    } else {
      videoRefs.current.delete(reelId);
    }
  }, []);

  if (isLoading) {
    return <LoadingCard />;
  }

  if (!reels.length) {
    return (
      <section className="mt-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('shop.reels')}</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>{t('No reels available for this shop')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('shop.reels')}</h2>
        <span className="text-sm text-gray-500">{reels.length} {t('reels')}</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {reels.map((reel) => (
          <div 
            key={reel.id} 
            className="relative group cursor-pointer"
            onMouseEnter={() => handleMouseEnter(reel.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleVideoClick(reel.id)}
          >
            <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-100">
              {reel.video_url ? (
                <>
                  <video
                    ref={setVideoRef(reel.id)}
                    src={reel.video_url}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    controls={false}
                    preload="metadata"
                  />
                  
                  {/* Play Icon Overlay (shows when not hovered and not playing) */}
                  {hoveredVideo !== reel.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <PlayIcon className="w-12 h-12 text-white opacity-80" />
                    </div>
                  )}

                  {/* Preview Indicator */}
                  {hoveredVideo === reel.id && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 rounded text-white text-xs">
                      Preview
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">{t('No video')}</span>
                </div>
              )}
              
              {/* Like Button */}
              <button
                onClick={(e) => handleLike(reel.id, e)}
                className={`absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all ${
                  !isSignedIn ? 'opacity-60' : ''
                }`}
                title={!isSignedIn ? 'Please log in to like reels' : 'Like this reel'}
              >
                {likedReels.has(reel.id) ? (
                  <HeartIconSolid className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Audio Control Button (only visible when playing) */}
              {hoveredVideo === reel.id && (
                <button
                  onClick={(e) => handleMuteToggle(reel.id, e)}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                >
                  {mutedVideos.has(reel.id) ? (
                    <SpeakerXMarkIcon className="w-4 h-4 text-white" />
                  ) : (
                    <SpeakerWaveIcon className="w-4 h-4 text-white" />
                  )}
                </button>
              )}

              {/* Reel Title Overlay */}
              {reel.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {reel.title}
                  </p>
                </div>
              )}
            </div>
            
            {/* Reel Description */}
            {reel.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {reel.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopReels;