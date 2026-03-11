# Firebase Phone Authentication Setup Guide

## Current Error Analysis

**Error**: 400 Bad Request when calling `sendVerificationCode`
**Cause**: Incomplete reCAPTCHA token or Firebase configuration issues

## Required Firebase Console Configuration

### 1. Enable Phone Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Phone" as a sign-in provider
3. Add your domain to authorized domains

### 2. Configure reCAPTCHA
1. In Firebase Console → Authentication → Settings → Authorized domains
2. Add your domains:
   - `localhost` (for development)
   - `kadin.app` (production)
   - `admin.kadin.app` (admin panel)

### 3. Phone Number Testing (Development)
1. Go to Authentication → Settings → Phone numbers for testing
2. Add test phone numbers with verification codes for development

### 4. App Check Configuration (Recommended)
1. Enable App Check in Firebase Console
2. Configure reCAPTCHA Enterprise for web apps
3. Add your domain to the allowlist

## Code Fixes Applied

### Enhanced reCAPTCHA Handling
- Added proper error handling for reCAPTCHA initialization
- Added container existence check
- Added reCAPTCHA render step before phone authentication
- Added cleanup on errors

### Required HTML Element
Make sure your sign-up/login forms include:
```html
<div id="sign-in-button"></div>
```

## Common Issues and Solutions

### Issue 1: "reCAPTCHA container not found"
**Solution**: Ensure the element with id "sign-in-button" exists in the DOM before calling phoneNumberSignIn

### Issue 2: "Invalid phone number format"
**Solution**: Ensure phone numbers are in E.164 format (e.g., "+1234567890")

### Issue 3: "reCAPTCHA verification failed"
**Solution**: 
- Check if domain is authorized in Firebase Console
- Verify reCAPTCHA site key configuration
- Ensure HTTPS in production

### Issue 4: "Quota exceeded"
**Solution**: 
- Check Firebase usage limits
- Implement rate limiting on client side
- Consider upgrading Firebase plan

## Testing Steps

1. **Development Testing**:
   ```bash
   # Test with a valid phone number
   phoneNumber: "+1234567890" # Use test numbers from Firebase Console
   ```

2. **Production Testing**:
   - Use real phone numbers
   - Ensure HTTPS is enabled
   - Verify domain authorization

## Environment Variables Check

Verify these environment variables are correctly set:
```env
NEXT_PUBLIC_API_KEY=AIzaSyAV3BYPU2xncEElk74aKVJtSRTf4oPY7eE
NEXT_PUBLIC_AUTH_DOMAIN=gshop-2c9dc.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=gshop-2c9dc
```

## Additional Debugging

Add this to your component to debug reCAPTCHA:
```javascript
// Add to your form component
useEffect(() => {
  // Ensure reCAPTCHA container exists
  if (!document.getElementById('sign-in-button')) {
    const recaptchaDiv = document.createElement('div');
    recaptchaDiv.id = 'sign-in-button';
    recaptchaDiv.style.display = 'none'; // Hidden for invisible reCAPTCHA
    document.body.appendChild(recaptchaDiv);
  }
}, []);
```

## Next Steps

1. Check Firebase Console configuration
2. Verify the reCAPTCHA container exists in your forms
3. Test with the enhanced error handling
4. Monitor browser console for detailed error messages
5. Consider implementing App Check for additional security