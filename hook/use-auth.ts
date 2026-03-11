"use client";

import { useEffect, useState } from "react";
import firebaseApp from "@/lib/firebase";
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
    const { signOut, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    await signOut(auth);
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

  const googleSignIn = async () => {
    const { signInWithPopup, GoogleAuthProvider, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  };

  const appleSignIn = async () => {
    const { signInWithPopup, OAuthProvider, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const appleAuthProvider = new OAuthProvider("apple.com");
    appleAuthProvider.addScope("email");
    appleAuthProvider.addScope("name");
    return signInWithPopup(auth, appleAuthProvider);
  };

  const facebookSignIn = async () => {
    const { FacebookAuthProvider, signInWithPopup, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const facebookAuthProvider = new FacebookAuthProvider();
    return signInWithPopup(auth, facebookAuthProvider);
  };

  const phoneNumberSignIn = async (phoneNumber: string) => {
    const { getAuth, signInWithPhoneNumber, RecaptchaVerifier } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    
    // Clean up any existing verifier
    const existingContainer = document.getElementById("sign-in-button");
    if (existingContainer) {
      existingContainer.innerHTML = '';
    }
    
    // Ensure the reCAPTCHA container exists
    const recaptchaContainer = document.getElementById("sign-in-button");
    if (!recaptchaContainer) {
      throw new Error("reCAPTCHA container not found. Make sure element with id 'sign-in-button' exists.");
    }
    
    const appVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      size: "invisible",
      callback: (response: string) => {
        console.log("reCAPTCHA solved:", response);
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
      },
      "error-callback": (error: any) => {
        console.error("reCAPTCHA error:", error);
      }
    });
    
    try {
      // Render the reCAPTCHA
      await appVerifier.render();
      console.log("Attempting to send SMS to:", phoneNumber);
      return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    } catch (error: any) {
      console.error("Phone authentication error:", error);
      
      // Provide more specific error messages
      if (error.code === 'auth/invalid-phone-number') {
        throw new Error('Invalid phone number format. Please use international format (+1234567890)');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      } else if (error.code === 'auth/quota-exceeded') {
        throw new Error('SMS quota exceeded. Please try again later.');
      }
      
      // Clean up the verifier on error
      appVerifier.clear();
      throw error;
    }
  };

  useEffect(() => {
    setIsSignedIn(hasCookie("token"));
  }, []);

  return { logOut, googleSignIn, appleSignIn, facebookSignIn, phoneNumberSignIn, isSignedIn };
};
