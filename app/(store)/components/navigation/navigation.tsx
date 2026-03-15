"use client";

import ActionIcon from "@/assets/icons/action";
import BagIcon from "@/assets/icons/bag";
import HeartIcon from "@/assets/icons/heart";
import { HomeIcon } from "@/assets/icons/home";
import clsx from "clsx";
import { ImageWithFallBack } from "@/components/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { ProfilePlaceholder } from "@/app/(store)/components/profile-placeholder";
import useSettingsStore from "@/global-store/settings";
import { useServerCart } from "@/hook/use-server-cart";
import useCartStore from "@/global-store/cart";
import dynamic from "next/dynamic";
import useUserStore from "@/global-store/user";
import { useTranslation } from "react-i18next";
import { useModal } from "@/hook/use-modal";
import { Drawer } from "@/components/drawer";
import ErrorBoundary from "@/components/error-boundary";

const CartBadge = dynamic(() =>
  import("./cart-badge").then((component) => ({ default: component.CartBadge }))
);

const ProfileSidebar = dynamic(() => import("../../(settings)/sidebar"));

const links = [
  {
    icon: <HomeIcon />,
    path: "/",
    requireAuth: false,
    name: "home",
  },
  {
    icon: <ActionIcon />,
    path: "/main",
    requireAuth: false,
    name: "catalog",
  },
  {
    icon: <HeartIcon />,
    path: "/liked",
    requireAuth: false,
    name: "favorites",
  },
  {
    icon: <BagIcon />,
    path: "/cart",
    requireAuth: false,
    name: "cart",
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const localUser = useUserStore((state) => state.user);
  const cartList = useCartStore((state) => state.list);
  const cartProductsQuantity = cartList?.length || 0;
  const [mounted, setMounted] = useState(false);
  const settings = useSettingsStore((state) => state.settings);
  const { t, i18n } = useTranslation();
  const uiType = settings?.ui_type;
  const [isDrawerOpen, openDrawer, closeDrawer] = useModal();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.profile(),
    enabled: !!localUser,
  });
  useServerCart(!!profile);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer when language changes to prevent DOM conflicts
  // useEffect(() => {
  //   // Only close if drawer is open and language actually changed
  //   if (isDrawerOpen) {
  //     // Use a small delay to allow current operations to complete
  //     const timer = setTimeout(() => {
  //       closeDrawer();
  //     }, 50); // Reduced delay
  //     return () => clearTimeout(timer);
  //   }
  // }, [i18n.language]); // Removed isDrawerOpen and closeDrawer from dependencies to prevent loops

  // Enhanced close handler with debugging
  const handleCloseDrawer = useCallback(() => {
    console.log("Closing drawer...", { isDrawerOpen }); // Debug log
    closeDrawer();
  }, [closeDrawer, isDrawerOpen]);

  // Enhanced open handler with debugging
  const handleOpenDrawer = useCallback(() => {
    console.log("Opening drawer...", { isDrawerOpen }); // Debug log
    openDrawer();
  }, [openDrawer, isDrawerOpen]);

  // Debug effect to track drawer state
  useEffect(() => {
    console.log("Drawer state changed:", { isDrawerOpen });
  }, [isDrawerOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className={clsx(
        "flex items-center ",
        uiType === "4"
          ? "justify-between w-screen bg-white dark:bg-dark px-6 py-5 md:gap-6 gap-4  md:max-w-max  md:bg-dark md:py-4 lg:px-9 md:px-6 md:rounded-full md:bg-opacity-75 dark:bg-opacity-75 md:backdrop-blur-lg "
          : "md:gap-6 gap-4  max-w-max  bg-dark md:py-4 lg:px-9 px-6  py-2 rounded-full bg-opacity-75  backdrop-blur-lg "
      )}
    >
      {links.map((link) => (
        <Link
          key={link.path}
          href={link.requireAuth && !profile ? "/settings" : link.path}
          aria-label={link.name}
          className={clsx(
            "relative outline-none focus-ring rounded-full ring-offset-2 border-transparent ",
            uiType !== "4" && "text-gray-layout",
            uiType === "4" &&
              "text-gray-field flex flex-col items-center gap-1.5 md:text-gray-layout",
            pathname.endsWith(link.path) &&
              uiType === "4" &&
              "text-primary before:hidden md:before:block before:absolute before:w-1 before:h-1 before:rounded-full before:bg-primary before:-bottom-2 before:left-1/2 before:-translate-x-1/2",
            pathname.endsWith(link.path) &&
              uiType !== "4" &&
              "before:absolute before:w-1 before:h-1 before:rounded-full before:bg-primary before:-bottom-2 before:left-1/2 before:-translate-x-1/2"
          )}
        >
          {link.icon}
          {((link.path === "/cart" && cartProductsQuantity > 0 && pathname !== "/products") ||
            (link.path === "/cart" && cartProductsQuantity > 0 && uiType === "4")) && (
            <CartBadge quantity={cartProductsQuantity} />
          )}
          {uiType === "4" && (
            <span className="text-xs font-semibold md:hidden">{t(link.name)}</span>
          )}
        </Link>
      ))}
      <button onClick={handleOpenDrawer} className="focus-ring outline-none rounded-full">
        {profile?.data?.img && !!localUser ? (
          <ImageWithFallBack
            src={profile?.data?.img}
            alt="profile"
            width={40}
            height={40}
            className="rounded-full aspect-square object-cover w-10 h-10"
          />
        ) : (
          <ProfilePlaceholder
            name={profile?.data && !!localUser ? profile?.data.firstname : settings?.title}
            size={40}
          />
        )}
      </button>
      <ErrorBoundary>
        <Drawer position="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
          <ErrorBoundary>
            <ProfileSidebar inDrawer onClose={handleCloseDrawer} />
          </ErrorBoundary>
        </Drawer>
      </ErrorBoundary>
    </nav>
  );
};
