import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import HomePage from './modules/home/HomePage';
import CalendarPage from './modules/calendar-main/CalendarPage';
import FortuneScreen from './screens/FortuneScreen';
import GreetingsScreen from './screens/GreetingsScreen';
import JournalScreen from './screens/JournalScreen';
import ConverterScreen from './screens/ConverterScreen';
import WorldClockScreen from './screens/WorldClockScreen';
import PrayersScreen from './screens/PrayersScreen';
import SettingsScreen from './screens/SettingsScreen';
import GoodDaysScreen from './screens/GoodDaysScreen';
import HoroscopeScreen from './screens/HoroscopeScreen';
import MemorialScreen from './screens/MemorialScreen';
import { LanguageProvider } from './contexts/LanguageContext';
import { EventProvider } from './contexts/EventContext';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { ThemeProvider } from './contexts/ThemeContext';
import UserAuth from './UserAuth';
import AddEventModal from './components/AddEventModal';
import FeatureUnderDevelopment from './components/FeatureUnderDevelopment';

const Layout: React.FC = () => {
  return (
    <div className="font-display bg-bg-base text-text-main min-h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex flex-shrink-0" />

      {/* Global Event Creation Modal */}
      <AddEventModal />

      {/* UserAuth (Desktop Top-Right) - Removed as per user request (login moved to Settings) */}
      {/* <UserAuth /> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden relative md:ml-64">
        <div className="flex-1 w-full mx-auto md:px-6 md:py-6 transition-all duration-300">
          <Outlet />
        </div>
        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <EventProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="fortune" element={<FortuneScreen />} />
                  <Route path="greetings" element={<GreetingsScreen />} />
                  {/* <Route path="journal" element={<JournalScreen />} />  -- Removed as per user request */}
                  <Route path="converter" element={<ConverterScreen />} />
                  <Route path="world-clock" element={<WorldClockScreen />} />
                  <Route path="prayers" element={<PrayersScreen />} />

                  {/* New Feature Placeholders */}
                  <Route path="good-days" element={<GoodDaysScreen />} />
                  <Route path="memorial" element={<MemorialScreen />} />
                  <Route path="horoscope" element={<HoroscopeScreen />} />
                  <Route path="feng-shui" element={<FeatureUnderDevelopment title="Phong Thủy" />} />
                  <Route path="numerology" element={<FeatureUnderDevelopment title="Thần Số Học" />} />
                  <Route path="utilities" element={<FeatureUnderDevelopment title="Tiện Ích Hay" />} />

                  <Route path="settings" element={<SettingsScreen />} />
                </Route>
              </Routes>
            </Router>
          </EventProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;