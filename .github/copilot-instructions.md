# AI Coding Instructions for LICH PRO

## Project Overview
LICH PRO is a React 18 + TypeScript lunar calendar mood tracking application with multi-screen navigation, Google Calendar integration, fortune/greetings, and AI-powered journaling. Built with **Vite 6.2**, Tailwind CSS, and **i18n support** (Vietnamese/English). Deploys to GitHub Pages via `gh-pages`.

## Architecture Overview

### Core Technology Stack
- **Framework**: React 18.2.0 + TypeScript 5.8 (strict mode)
- **Build**: Vite 6.2 + `@vitejs/plugin-react`
- **Routing**: React Router v6.14.2 (HashRouter for GitHub Pages)
- **Styling**: Tailwind CSS (utility-first, dark mode via `dark:` prefix)
- **External APIs**: Firebase 12.7.0 (auth), Google Calendar (OAuth + Calendar API), Gemini AI (`@google/genai`), OpenMeteo (weather)
- **Lunar Calendar**: `lunisolar` 2.6.0 (only version supported—do NOT upgrade)
- **Deployment**: GitHub Pages (via `gh-pages` 6.1.1)

### Project Structure
```
App.tsx                    # Root with LanguageProvider → EventProvider → Router setup
index.tsx                  # React mount point + Tailwind import
vite.config.ts            # Loads GEMINI_API_KEY; alias '@' to root; base '/'

modules/                  # NEW MODULES (1 feature = 1 folder with .logic.ts)
├── home/                 # HomePage + useHomePageLogic (weather, greeting, user profile)
├── calendar-main/        # CalendarPage + calendarPage.logic.ts
├── fortune/              # FortuneScreen + fortune.logic.ts (bamboo shaker)
└── settings/             # SettingsScreen + settings.logic.ts (profile, sync)

screens/                  # LEGACY SCREENS (being migrated to modules/)
├── FortuneScreen.tsx
├── ConverterScreen.tsx
├── JournalScreen.tsx
└── ...

contexts/                 # Global state providers
├── EventContext.tsx      # Google Calendar events (via Firebase auth)
├── LanguageContext.tsx   # i18n: 'vi' | 'en' (persists to localStorage)
└── ...

services/                 # External API calls (pure functions, no state)
├── googleCalendarService.ts  # OAuth, getUserProfile()
├── calendarService.ts        # fetchGoogleEvents()
├── aiJournalService.ts       # Gemini API integration
├── fortuneService.ts         # Fortune logic
└── ...

types/                    # Domain-specific type files
├── homeTypes.ts          # UserProfile, WeatherData, LocationData, SearchResult
├── calendarTypes.ts      # GoogleEvent, CalendarEvent, DateInfo
├── journalTypes.ts       # JournalEntry, MoodAnalysis
└── ...

constants/                # Centralized constants
├── translations.ts       # TRANSLATIONS[language][path] (nested structure)
├── calendarConstants.ts  # SOLAR_HOLIDAYS, LUNAR_HOLIDAYS
├── homeConstants.ts      # DEFAULT_LOCATION, DEFAULT_WEATHER
└── converterConstants.ts

components/               # LEGACY UI components (refactoring to modules/)
├── BottomNav.tsx         # Mobile navigation
├── Sidebar.tsx           # Desktop navigation
├── calendar/             # Calendar subcomponents
├── home/                 # Home subcomponents
└── ...

utils/                    # Helper functions
├── lunarDataGenerator.ts # Generate lunar calendar data
└── ...

public/
└── CNAME                 # GitHub Pages custom domain

.env.local                # GEMINI_API_KEY (required for AI features)
firebase.ts               # Firebase config + auth instance
```

## Critical Architectural Patterns

### 1. Module Logic Pattern (Module-Local Business Logic)
**Pattern**: Each major screen lives in `modules/{feature}/` with a dedicated `{feature}.logic.ts` file using custom hooks.

**Example**: [modules/home/home.logic.ts](modules/home/home.logic.ts) exports `useHomePageLogic()` hook that encapsulates:
- **State**: `currentTime`, `weather`, `user`, `greeting`, `currentLocation`, `loadingWeather`, `searchQuery`, `searchResults`
- **Effects**: Clock timer, weather fetch (OpenMeteo API), user profile load from Firebase
- **Handlers**: `handleSearch()`, `handleSelectLocation()`, `fetchWeatherData()`, `loadUser()`
- **Returns**: `{ state: { ... }, actions: { ... } }`

**Why**: Separates presentation (JSX in `HomePage.tsx`) from business logic. Logic hook can be tested independently and reused if needed.

**Convention**: 
- Logic file: `{feature}.logic.ts` exports `use{Feature}Logic()` hook
- Component: `{Feature}.tsx` imports and destructures: `const { state, actions } = use{Feature}Logic()`
- Always return shape: `{ state: {...}, actions: {...} }` for consistency
- Effects in logic handle: timers, API calls, event listeners
- Component handles: rendering, onClick/onChange binding, conditional rendering

### 2. Global State via React Context
**EventContext** ([contexts/EventContext.tsx](contexts/EventContext.tsx)): Manages Google Calendar events fetched from user account.
- Subscribes to Firebase `onAuthStateChanged()` → auto-fetches events when user logs in
- Cleans event data: maps `start.dateTime || start.date`, includes `id, summary, start, end, colorId, description`
- Provides `useEvents()` hook for accessing events anywhere
- Call `refreshEvents()` to manually reload events

**LanguageContext** ([contexts/LanguageContext.tsx](contexts/LanguageContext.tsx)): Manages i18n state.
- Supports `'vi'` (Vietnamese) and `'en'` (English)
- Persists to localStorage under `app_settings` → syncs with old code using `lang: 'Tiếng Việt' | 'English'` labels
- Helper function `t(path)` navigates nested `TRANSLATIONS[language]` (e.g., `t('home.greeting')`)
- Returns key itself if path not found (useful for debugging)

**Pattern**: Wrap providers at App root in correct order:
```tsx
<LanguageProvider>
  <EventProvider>
    <Router>...</Router>
  </EventProvider>
</LanguageProvider>
```

### 3. Type-Driven Development
**Convention**: Create domain-specific type files in `types/`:
- `calendarTypes.ts` for calendar domain
- `homeTypes.ts` for home/weather/profile
- `journalTypes.ts` for journal entries

**Example**: Types like `UserProfile`, `LocationData`, `WeatherData` are defined once and imported throughout.

### 4. Constants Centralization
All domain constants live in `constants/{domain}Constants.ts`:
- `calendarConstants.ts`: SOLAR_HOLIDAYS, LUNAR_HOLIDAYS, month/day translations
- `homeConstants.ts`: DEFAULT_LOCATION, DEFAULT_WEATHER
- `translations.ts`: TRANSLATIONS object with nested structure for i18n

**Access via**: `import { TRANSLATIONS } from '../constants/translations'`

### 5. Service Layer for External APIs
External calls isolated in `services/`:
- **googleCalendarService.ts**: OAuth flow, `initializeGapiClient()`, `getUserProfile()`, mocks in DEMO mode
- **calendarService.ts**: `fetchGoogleEvents()` - calls Google Calendar API (fetches events 1 month back to 1 year ahead, max 2500 results)
- **fortuneService.ts**: Random fortune logic
- **aiJournalService.ts**: Gemini API calls for journal analysis (requires `GEMINI_API_KEY`)

**Pattern**: Services are purely functional (no state), called from logic hooks. Handle API errors gracefully; return null/empty on failure.

## Critical Developer Workflows

### Running Locally
```bash
npm install
# Set GEMINI_API_KEY in .env.local
npm run dev  # Vite dev server on :3000
```

### Building & Deployment
```bash
npm run build     # Creates dist/ folder
npm run preview   # Test prod build locally
npm run deploy    # Pushes to gh-pages branch (GitHub Pages)
```

### Environment Variables
- `GEMINI_API_KEY`: Required for AI journal features (set in `.env.local`)
- Loaded in [vite.config.ts](vite.config.ts) via `loadEnv()` and exposed as `process.env.GEMINI_API_KEY`

### Vite Configuration Notes
- `alias '@'` points to project root for cleaner imports
- Base is `/` (not a subpath) because deployment uses `https://huhrevn.github.io/lich-mood` via CNAME
- Server runs on port 3000 with `host: 0.0.0.0` for network access

## Project-Specific Conventions

### Naming
- Components: PascalCase, colocated with logic in `modules/{feature}/`
- Hooks: `use{Feature}Logic` for custom hooks, `use{Feature}` for utility hooks
- Context: Exported as `{Feature}Provider` (component) and `use{Feature}` (hook)
- Files with i18n keys: Use nested dot notation (`home.greeting`, `calendar.today`)

### React Router Setup
- Uses **HashRouter** (not BrowserRouter) because app deploys to `/lich-mood` subdirectory via CNAME
- Routes defined centrally in [App.tsx](App.tsx) with Layout outlet pattern
- Mobile: BottomNav; Desktop: Sidebar for navigation

### Styling Approach
- Tailwind CSS utility-first (no custom CSS files expected)
- Dark mode: Use `dark:` prefix for dark theme variants
- Responsive: Mobile-first, breakpoints: `md:` (tablet), `xl:` (desktop)
- Colors: Defined as Tailwind classes like `bg-bg-base`, `text-text-main`, `accent-green`

### State Management Rules
- Local component state: `useState()` (e.g., modals, input fields)
- Cross-component state: React Context (events, language)
- Avoid Redux/Zustand (not in dependencies)

### Google Calendar Integration
- Requires Firebase Auth setup
- Token stored in localStorage under `google_calendar_token`
- API call in [calendarService.ts](calendarService.ts): fetches events from `timeMin` (1 month ago) to `timeMax` (1 year ahead)
- Max 2500 results to prevent missing events
- Event fields: id, summary, start (dateTime | date), end, colorId, description

### Lunar Calendar Conversion
- Uses `lunisolar` library (v2.6.0) for solar↔lunar date conversion
- Never parse lunar dates manually; always use: `lunisolar(Date).toLunar()` and `.toSolar()`
- Store both solar and lunar date info if needed (calendar displays both)

### i18n Pattern
- Define strings in [constants/translations.ts](constants/translations.ts) under `TRANSLATIONS[language]`
- Access via `useLanguage().t('path.to.key')`
- Always use nested structure for organization

## Integration Points & Data Flows

### Event Flow: User Logs In → Calendar Updates
1. User authenticates via Firebase (UserAuth component)
2. EventContext listens via `onAuthStateChanged()`
3. On login: `loadEvents()` calls `fetchGoogleEvents()`
4. Events stored in EventContext state
5. CalendarPage imports via `useEvents()` and passes to CalendarGrid/CalendarEventList

### Weather & Greeting Flow
- Home module fetches weather from OpenMeteo API (free, no key needed)
- Greeting determined by current time: morning/afternoon/evening logic in [modules/home/home.logic.ts](modules/home/home.logic.ts)
- WeatherCard displays current location + forecast

### AI Journal Flow
- Journal screen calls `aiJournalService.ts` → Gemini API
- Requires `GEMINI_API_KEY` in env
- Input: journal text; Output: mood analysis, summary

## Common Gotchas & Best Practices

1. **Always use `useEvents()`** when accessing Google Calendar events, not local state
2. **HashRouter** required for GitHub Pages; don't switch to BrowserRouter
3. **Lunar dates**: Never manually parse; always use `lunisolar` library functions
4. **Tailwind build**: All used class names must be in JSX/templates for PurgeCSS to include them
5. **i18n keys**: Must exist in TRANSLATIONS or `t()` returns the key itself (no errors thrown)
6. **Mobile-first CSS**: Write for mobile, then add `md:`, `xl:` breakpoints
7. **Dark mode**: Test with `dark:` classes; enable via system preference or app setting
8. **Firebase setup**: Keep `firebase.ts` synchronized with Firebase project config
