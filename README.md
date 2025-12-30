# Mofo Pest Scout Frontend

A comprehensive React Native web and mobile application for the Mofo Pest Scouting System. This application enables scouts to record pest observations in greenhouse and field operations, while providing managers with powerful analytics dashboards and reporting capabilities.

## Features

### For Scouts
- **Scouting Sessions**: Record pest observations across greenhouse bays and benches
- **Offline Support**: Work without internet connectivity in remote farm locations
- **Grid-Based Entry**: Intuitive grid interface for systematic bay/bench/spot data entry
- **Species Tracking**: Record pests, diseases, and beneficial organisms
- **Photo Capture**: Attach photos to observations for documentation
- **Real-time Sync**: Automatic synchronization when connectivity is restored

### For Managers & Admins
- **Dashboard Overview**: At-a-glance KPIs for farm health and scouting activity
- **Heat Maps**: Visual representation of pest pressure across farm structures
- **Analytics**: Weekly and monthly trend analysis of pest populations
- **Session Management**: Create and assign scouting sessions to scouts
- **Reports**: Generate and export comprehensive pest reports
- **Multi-Farm Support**: Manage multiple farm operations from a single interface

## Technology Stack

- **React Native 0.73** - Cross-platform mobile framework
- **Expo 50** - Development and build tooling
- **TypeScript** - Type-safe development
- **React Navigation** - Native stack and tab navigation
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Axios** - HTTP client with interceptors
- **React Native Paper** - Material Design components
- **Victory Native** - Data visualization charts
- **Date-fns** - Date manipulation utilities

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio
- Java Spring Boot backend running on `http://localhost:8080`

## Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd mofo-pest-scout-frontend
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
```

3. **Configure environment**:
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

For production:
```env
EXPO_PUBLIC_API_URL=https://api.yourproduction.com/api
```

## Running the Application

### Web Development
```bash
npm run web
```
Opens at `http://localhost:19006`

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Physical Device
```bash
npm start
```
Then scan the QR code with Expo Go app (iOS/Android)

## Project Structure

```
mofo-pest-scout-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── cards/           # Card components
│   │   ├── forms/           # Form components
│   │   ├── common/          # Common components
│   │   └── charts/          # Chart components
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── [feature]Navigator.tsx
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── dashboard/       # Dashboard screens
│   │   ├── scouting/        # Scouting screens
│   │   ├── analytics/       # Analytics screens
│   │   ├── farm/            # Farm management screens
│   │   └── profile/         # Profile screens
│   ├── services/            # API services
│   │   ├── api.client.ts    # Axios configuration
│   │   ├── auth.service.ts
│   │   ├── farm.service.ts
│   │   ├── scouting.service.ts
│   │   └── analytics.service.ts
│   ├── store/               # State management
│   │   ├── AuthContext.tsx  # Auth context provider
│   │   ├── farmStore.ts     # Farm Zustand store
│   │   └── scoutingStore.ts # Scouting Zustand store
│   ├── types/               # TypeScript type definitions
│   │   └── api.types.ts     # API DTOs matching backend
│   ├── theme/               # Theme configuration
│   │   └── theme.ts         # Colors, typograph, spacing
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts       # General helpers
│   │   └── toastConfig.tsx  # Toast notifications
│   └── hooks/               # Custom React hooks
├── assets/                  # Static assets
├── App.tsx                  # App entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## Key Features Implementation

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh on 401 responses
- Secure token storage with AsyncStorage
- Role-based access control (SCOUT, MANAGER, FARM_ADMIN, SUPER_ADMIN)

### Offline Functionality
- Local database with SQLite (planned)
- Queue system for pending API calls
- Background sync when connectivity restored
- Conflict resolution for simultaneous edits

### Grid-Based Observation Entry
- Dynamic grid rendering based on farm configuration
- Cell-level pest count recording
- Multi-species tracking per cell
- Color-coded severity indicators

### Heat Map Visualization
- Weekly/monthly pest pressure visualization
- Farm-level and section-level views
- Interactive cell selection for details
- Export functionality for reports

### Real-time Analytics
- KPI tracking (sessions completed, observations, pest counts)
- Trend charts using Victory Native
- Severity distribution analysis
- Comparative analytics across time periods

## API Integration

The application integrates with the Spring Boot backend at the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Current user info

### Farms
- `GET /api/farms` - List farms
- `GET /api/farms/{farmId}` - Farm details
- `POST /api/farms` - Create farm (Super Admin)
- `PUT /api/farms/{farmId}` - Update farm

### Scouting Sessions
- `GET /api/scouting/sessions?farmId={id}` - List sessions
- `GET /api/scouting/sessions/{sessionId}` - Session details
- `POST /api/scouting/sessions` - Create session
- `POST /api/scouting/sessions/{id}/start` - Start session
- `POST /api/scouting/sessions/{id}/complete` - Complete session
- `POST /api/scouting/sessions/{id}/observations` - Add observation

### Analytics
- `GET /api/farms/{farmId}/heatmap?week={w}&year={y}` - Heat map data
- `GET /api/analytics/farms/{farmId}/weekly?week={w}&year={y}` - Weekly analytics

## Development

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode enabled

### Testing
```bash
npm test
```

### Building for Production

**Web**:
```bash
npm run build:web
```

**iOS**:
```bash
expo build:ios
```

**Android**:
```bash
expo build:android
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080/api` |

## Troubleshooting

### Common Issues

**Metro bundler issues**:
```bash
npm start -- --reset-cache
```

**iOS build issues**:
```bash
cd ios && pod install && cd ..
```

**Android build issues**:
```bash
cd android && ./gradlew clean && cd ..
```

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Submit pull request with description
4. Ensure CI passes

## License

Proprietary - Mofo Technologies

## Support

For issues and questions:
- Email: support@mofo-tech.com
- Documentation: https://docs.mofo-tech.com