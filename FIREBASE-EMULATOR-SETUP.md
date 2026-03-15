# Firebase Auth Emulator Setup

## Installation

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init emulators
```

## Configuration

Create `firebase.json` in your project root:

```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

## Update Firebase Config for Development

Add this to your `lib/firebase.ts`:

```javascript
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// ... existing code ...

const auth = getAuth(app);

// Connect to emulator in development
if (process.env.NODE_ENV === 'development' && !auth.config.emulator) {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { auth };
```

## Usage

```bash
# Start the emulator
firebase emulators:start --only auth

# Your app will now use the emulator for authentication
# Access the emulator UI at http://localhost:4000
```

## Benefits

- No SMS costs or limits
- Faster testing
- Offline development
- Easy user management via UI