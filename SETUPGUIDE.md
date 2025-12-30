# Setup Guide - Mofo Pest Scout Frontend

Complete step-by-step guide to set up and run the application.

## Prerequisites

### Required Software
- **Node.js** 18+ and npm (or yarn)
  - Download from: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **Expo CLI**
  ```bash
  npm install -g expo-cli
  ```

- **Git**
  - Download from: https://git-scm.com/
  - Verify: `git --version`

### Optional (for native development)
- **iOS Development** (macOS only):
  - Xcode 14+ from Mac App Store
  - CocoaPods: `sudo gem install cocoapods`

- **Android Development**:
  - Android Studio with Android SDK
  - JDK 11+

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd mofo-pest-scout-frontend

# Install dependencies
npm install
# or
yarn install
```

## Step 2: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

### Environment Variables

```env
# Development (local backend)
EXPO_PUBLIC_API_URL=http://localhost:8080/api

# Production
# EXPO_PUBLIC_API_URL=https://api.yourproduction.com/api

# For Android emulator accessing localhost
# EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api

# For iOS simulator accessing localhost
# EXPO_PUBLIC_API_URL=http://localhost:8080/api

# For physical device on same network
# EXPO_PUBLIC_API_URL=http://192.168.1.XXX:8080/api
# (Replace XXX with your computer's local IP)
```

### Finding Your Local IP (for physical devices)

**macOS/Linux:**
```bash
ifconfig | grep "inet "
```

**Windows:**
```bash
ipconfig
```

Look for "IPv4 Address" under your active network adapter.

## Step 3: Start the Backend

Ensure your Spring Boot backend is running:

```bash
# In your backend directory
./mvnw spring-boot:run
# or
./gradlew bootRun
```

Backend should be accessible at `http://localhost:8080`

## Step 4: Run the Application

### Web Development (Recommended for quick testing)

```bash
npm run web
```

This opens the app in your browser at `http://localhost:19006`

### iOS Simulator (macOS only)

```bash
npm run ios
```

First time will take longer as it builds the app.

### Android Emulator

```bash
npm run android
```

Make sure you have an Android emulator running first.

### Physical Device (Expo Go)

```bash
npm start
```

Then:
1. Install "Expo Go" app on your phone:
   - iOS: App Store
   - Android: Play Store

2. Scan the QR code:
   - iOS: Use Camera app
   - Android: Use Expo Go app scanner

## Step 5: Test the Setup

### Create a Test Account

1. **Option A: Use Backend API Directly**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "testpassword123",
       "firstName": "Test",
       "lastName": "User",
       "phoneNumber": "1234567890",
       "role": "SCOUT"
     }'
   ```

2. **Option B: Use the App**
   - Click "Register" on login screen
   - Fill in the form
   - Create account

### Login and Verify

1. Login with your test credentials
2. You should see the Dashboard screen
3. Verify API connection by checking for any error toasts

## Troubleshooting

### Issue: "Network request failed"

**Cause**: Can't reach backend API

**Solutions**:
1. Verify backend is running: `curl http://localhost:8080/actuator/health`
2. Check `.env` has correct API_URL
3. For physical devices, use computer's local IP
4. For Android emulator, use `10.0.2.2` instead of `localhost`

### Issue: "Metro bundler not starting"

**Solution**:
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Issue: "Unable to resolve module"

**Solution**:
```bash
# Clear watchman cache (macOS/Linux)
watchman watch-del-all

# Clear metro cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: iOS build fails

**Solution**:
```bash
cd ios
pod install
cd ..
npm run ios
```

### Issue: Android build fails

**Solution**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: TypeScript errors

**Solution**:
```bash
# Check TypeScript
npx tsc --noEmit

# If still having issues, restart TypeScript server in your IDE
```

## Development Workflow

### Hot Reloading

The app automatically reloads when you save changes:
- **Web**: Instant hot reload
- **Mobile**: Fast Refresh (save file to see changes)

### Debugging

**React DevTools** (Web):
- Install browser extension
- Open DevTools in browser

**React Native Debugger** (Mobile):
- Download from: https://github.com/jhen0409/react-native-debugger
- Shake device → "Debug" → Opens debugger

**Console Logs**:
```javascript
console.log('Debug message');
console.warn('Warning message');
console.error('Error message');
```

### Inspecting Network Requests

**Web**:
- Browser DevTools → Network tab

**Mobile**:
- Use React Native Debugger
- Or Flipper: https://fbflipper.com/

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components (pages)
├── navigation/     # Navigation configuration
├── services/       # API service layer
├── store/          # State management (Context + Zustand)
├── types/          # TypeScript type definitions
├── theme/          # Design system (colors, typograph)
├── utils/          # Helper functions
└── hooks/          # Custom React hooks
```

## Common Development Tasks

### Add a New Screen

1. Create screen file: `src/screens/[module]/[ScreenName].tsx`
2. Add to navigator: `src/navigation/[Module]Navigator.tsx`
3. Define route type in navigation types
4. Implement screen component

### Add a New API Endpoint

1. Add types to `src/types/api.types.ts`
2. Add service method to `src/services/[module].service.ts`
3. Use in component with try-catch
4. Handle errors with toast notifications

### Add a New Component

1. Create component: `src/components/[category]/[ComponentName].tsx`
2. Export from index: `src/components/[category]/index.tsx`
3. Import where needed: `import { ComponentName } from '@components/[category]'`

### Update Theme

Edit `src/theme/theme.ts`:
- Colors
- typograph
- Spacing
- Shadows

Changes apply app-wide immediately.

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Building for Production

### Web

```bash
npm run build:web
```

Output in `web-build/` directory.

### iOS

```bash
expo build:ios
```

Or use EAS Build:
```bash
npm install -g eas-cli
eas build --platform ios
```

### Android

```bash
expo build:android
```

Or use EAS Build:
```bash
eas build --platform android
```

## Next Steps

1. **Read the Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
2. **Review Project Structure**: `PROJECT_STRUCTURE.md`
3. **Check Main README**: `README.md`
4. **Start implementing remaining screens**

## Getting Help

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **TypeScript**: https://www.typescriptlang.org/

## Quick Reference

### Useful Commands

```bash
# Start development server
npm start

# Start web
npm run web

# Start iOS
npm run ios

# Start Android
npm run android

# Clear cache
npm start -- --reset-cache

# Check types
npx tsc --noEmit

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

### File Paths Reference

- **Components**: `@components/[category]/ComponentName`
- **Screens**: `@screens/[module]/ScreenName`
- **Services**: `@services/[module].service`
- **Types**: `@types/api.types`
- **Utils**: `@utils/helpers`
- **Theme**: `@theme/theme`
- **Store**: `@store/[storeName]`

Happy coding! 🚀