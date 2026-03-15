# Troubleshooting Guide

## Common Issues and Solutions

### 1. Fetch Failed Error

**Error:** `Error: fetch failed` from `lib/fetcher.ts`

**Cause:** The API server at `https://back.kadin.app/api/` is not responding or unreachable.

**Solutions:**

#### Option A: Check API Server Status
1. Verify that the API server is running and accessible
2. Test the API endpoint directly: `https://back.kadin.app/api/`
3. Check your internet connection

#### Option B: Use Local Development API
1. Set up a local API server
2. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:8000/api/
   ```
3. Replace with your local API server URL

#### Option C: Use Mock Data (Development Only)
1. Create mock data services for development
2. Modify the fetcher to return mock data when the API is unavailable

### 2. Missing Translation Keys

**Error:** Translation keys showing as raw keys (e.g., "compare.list.is.empty")

**Cause:** Translation keys are not loaded from the API or missing from fallback translations.

**Solution:** 
- Translation keys have been added to the fallback translations in `lib/i18n.ts`
- If you need more translations, add them to the fallback object in that file

### 3. Image Loading Errors

**Error:** `Failed to parse src "url.webp" on next/image`

**Cause:** Invalid image URLs being passed to Next.js Image component.

**Solution:** 
- All cart-related components have been updated to use `ImageWithFallBack`
- This component validates URLs and shows fallback images for invalid URLs

## Environment Setup

### Required Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_BASE_URL=your_api_server_url
NEXT_PUBLIC_API_KEY=your_firebase_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
# ... other Firebase config
```

### Development Mode

To run in development mode:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Getting Help

If you continue to experience issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the API server is running and accessible
4. Check network connectivity
