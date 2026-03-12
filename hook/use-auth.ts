"use client";

import { useEffect, useState } from "react";
import { deleteCookie, hasCookie } from "cookies-next";
import useUserStore from "@/global-store/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSearchHistoryStore from "@/global-store/search-history";
import useLikeStore from "@/global-store/like";
import useCartStore from "@/global-store/cart";
import useCompareStore from "@/global-store/compare";
import { useFcmToken } from "@/hook/use-fcm-token";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { signOut: localSignOut } = useUserStore();
  const clearSearchHistory = useSearchHistoryStore((state) => state.clear);
  const clearLikeList = useLikeStore((state) => state.clear);
  const clearCart = useCartStore((state) => state.clear);
  const clearCompareList = useCompareStore((state) => state.clear);
  const { fcmToken } = useFcmToken();
  const { mutate: serverLogout } = useMutation({
    mutationFn: (body: { token: string }) => authService.logout(body),
    mutationKey: ["logout"],
  });

  const handleLogoutLocal = async () => {
    setIsSignedIn(false);
    deleteCookie("token");
    localSignOut();
    queryClient.clear();
    clearSearchHistory();
    clearLikeList();
    clearCart();
    clearCompareList();
  };

  const logOut = async () => {
    router.replace("/");
    if (fcmToken) {
      serverLogout(
        { token: fcmToken },
        {
          onSuccess: async () => {
            router.replace("/");
            await handleLogoutLocal();
          },
        }
      );
      return;
    }
    await handleLogoutLocal();
  };

  useEffect(() => {
    setIsSignedIn(hasCookie("token"));
  }, []);

  return { logOut, isSignedIn };
};
