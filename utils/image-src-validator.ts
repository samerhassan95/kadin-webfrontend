/**
 * Validates and sanitizes image src values for Next.js Image component
 * @param src - The image source URL
 * @returns A valid image URL or null if invalid
 */
export const validateImageSrc = (src: string | undefined | null): string | null => {
  if (!src) return null;

  // Check for known invalid values
  if (src === "url.webp" || src === "" || src.trim() === "") {
    return null;
  }

  // Check if it's a valid URL format
  try {
    // For relative paths, they should start with /
    if (!src.startsWith("/") && !src.startsWith("http://") && !src.startsWith("https://")) {
      return null;
    }
    return src;
  } catch {
    return null;
  }
};

/**
 * Safe image src that returns a fallback for invalid URLs
 * @param src - The image source URL
 * @param fallback - Fallback URL (optional)
 * @returns A valid image URL or fallback
 */
export const safeImageSrc = (src: string | undefined | null, fallback?: string): string | null => {
  const validSrc = validateImageSrc(src);
  return validSrc || fallback || null;
};
