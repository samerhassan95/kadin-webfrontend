"use client";

import React, { useEffect, useRef, useState } from "react";
import { Drawer } from "@/components/drawer";
import ErrorBoundary from "@/components/error-boundary";

interface SafeDrawerProps {
  position: "left" | "right" | "top" | "bottom";
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  keyPrefix?: string;
}

const SafeDrawer: React.FC<SafeDrawerProps> = ({
  position,
  open,
  onClose,
  children,
  keyPrefix = "drawer",
}) => {
  const [renderKey, setRenderKey] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Force re-render when drawer closes to prevent stale DOM references
  useEffect(() => {
    if (!open) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Small delay to allow close animation, then force re-render
      timeoutRef.current = setTimeout(() => {
        setRenderKey((prev) => prev + 1);
      }, 300); // Match typical drawer animation duration
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const handleError = (error: Error) => {
    console.warn("Drawer error handled:", error.message);
    // Force close drawer on error
    onClose();
    // Force re-render
    setRenderKey((prev) => prev + 1);
  };

  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      console.error("Error closing drawer:", error);
      // Force close anyway
      setRenderKey((prev) => prev + 1);
    }
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={null} // Don't show fallback for drawer errors, just hide
    >
      <Drawer
        key={`${keyPrefix}-${renderKey}`}
        position={position}
        open={open}
        onClose={handleClose}
      >
        <ErrorBoundary onError={handleError}>{children}</ErrorBoundary>
      </Drawer>
    </ErrorBoundary>
  );
};

export default SafeDrawer;
