# Quick Start Guide

Get the Mofo Pest Scout app running in 5 minutes.

## Prerequisites ✅

- Node.js 18+ installed
- Backend running at `http://localhost:8080`

## Installation (2 minutes)

```bash
# 1. Navigate to project
cd mofo-pest-scout-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the app
npm run web
```

App opens at `http://localhost:19006`

## Test Login

**Create test user** (one-time):
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "scout@test.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Scout",
    "phoneNumber": "1234567890",
    "role": "SCOUT"
  }'
```

**Login credentials**:
- Email: `scout@test.com`
- Password: `password123`

## What Works Now ✅

The following features are fully functional:

### 🔐 Authentication
- Login with validation
- Registration
- JWT token management
- Auto token refresh
- Role-based access

### 📊 Dashboard
- KPI cards
- Quick actions
- Recent sessions
- Farm selector

### 🏭 Farm Management
- Farm list with search
- Farm cards with status
- Role-based farm access

### 📋 Scouting Sessions
- Session list with filters
- Session cards
- Status tracking
- Search functionality

### 🎨 UI/UX
- Material Design components
- Consistent theme
- Loading states
- Error handling
- Toast notifications
- Empty states

## Project Structure

```
src/
├── screens/          # 6 screens completed
│   ├── auth/        # Login, Register ✅
│   ├── dashboard/   # Dashboard ✅
│   ├── farm/        # FarmList ✅
│   └── scouting/    # SessionList ✅
├── components/      # Reusable components
│   ├── cards/       # FarmCard, SessionCard ✅
│   └── common/      # LoadingSpinner, EmptyState, etc. ✅
├── services/        # All API services ✅
├── store/           # State management ✅
├── navigation/      # Complete navigation ✅
└── theme/           # Design system ✅
```

## Next to Implement 🔨

**Most Critical** (implement these first):

1. **ObservationGridScreen** - Main scout data entry
2. **HeatMapScreen** - Visual pest pressure map
3. **SessionDetailScreen** - View session data
4. **CreateSessionScreen** - Create new sessions

See `FILE_CHECKLIST.md` for complete list.

## Development Commands

```bash
# Web (instant reload)
npm run web

# iOS simulator (macOS)
npm run ios

# Android emulator
npm run android

# Physical device
npm start
# Then scan QR code with Expo Go app

# Clear cache
npm start -- --reset-cache

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## File Organization

### To add a new screen:
1. Create: `src/screens/[module]/[Name]Screen.tsx`
2. Add to: `src/navigation/[Module]Navigator.tsx`
3. Follow pattern from `LoginScreen.tsx`

### To add an API endpoint:
1. Add types: `src/types/api.types.ts`
2. Add method: `src/services/[module].service.ts`
3. Use with try-catch in component

### To add a component:
1. Create: `src/components/[category]/[Name].tsx`
2. Import: `import { Name } from '@components/[category]'`

## Key Files Reference

| File | Purpose |
|------|---------|
| `App.tsx` | App entry point |
| `src/types/api.types.ts` | All TypeScript types |
| `src/services/api.client.ts` | HTTP client setup |
| `src/store/AuthContext.tsx` | Auth state |
| `src/theme/theme.ts` | Design system |
| `src/utils/helpers.ts` | Utility functions |

## API Integration

All backend endpoints are integrated:

```typescript
// Authentication
authService.login(email, password)
authService.register(data)
authService.getCurrentUser()

// Farms
farmService.getFarms()
farmService.getFarm(id)
farmService.createFarm(data)

// Sessions
scoutingService.getSessions(farmId)
scoutingService.getSession(id)
scoutingService.createSession(data)
scoutingService.upsertObservation(data)

// Analytics
analyticsService.getHeatmap(farmId, week, year)
```

## State Management

**Global State** (AuthContext):
```typescript
const { user, isAuthenticated, login, logout, hasRole } = useAuth();
```

**Local State** (Zustand):
```typescript
const { farms, fetchFarms, setCurrentFarm } = useFarmStore();
const { sessions, fetchSessions } = useScoutingStore();
```

## Theme Usage

```typescript
import { colors, spacing, typograph } from '@theme/theme';

<View style={{ 
  backgroundColor: colors.surface,
  padding: spacing.md,
}}>
  <Text style={typograph.h3}>Title</Text>
</View>
```

## Common Patterns

### API Call with Loading
```typescript
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
  setIsLoading(true);
  try {
    const data = await someService.getData();
    // use data
  } catch (error) {
    showErrorToast('Failed', getErrorMessage(error));
  } finally {
    setIsLoading(false);
  }
};
```

### Form with Validation
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## Troubleshooting

**Can't connect to backend?**
```bash
# Test backend
curl http://localhost:8080/actuator/health

# Update .env
EXPO_PUBLIC_API_URL=http://localhost:8080/api

# For Android emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api
```

**Module not found?**
```bash
npm start -- --reset-cache
```

**Build errors?**
```bash
rm -rf node_modules
npm install
```

## Documentation

- **Setup Guide**: `SETUP_GUIDE.md` - Detailed setup
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md` - Architecture
- **File Checklist**: `FILE_CHECKLIST.md` - All files status
- **Project Structure**: `PROJECT_STRUCTURE.md` - File tree
- **Main README**: `README.md` - Full documentation

## Get Help

- Check documentation files above
- Review completed screens as examples
- All patterns are established and working
- Type definitions match backend exactly

## Ready to Code! 🚀

You now have:
- ✅ Complete project foundation
- ✅ Working authentication
- ✅ API integration
- ✅ State management
- ✅ Navigation structure
- ✅ Design system
- ✅ Sample screens
- ✅ Comprehensive docs

Start implementing the remaining screens following the established patterns!

Happy coding! 💻✨