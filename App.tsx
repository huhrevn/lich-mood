
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
import { LanguageProvider } from './contexts/LanguageContext';

const Layout: React.FC = () => {
    return (
        <div className="font-display bg-bg-base text-text-main min-h-screen flex overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex flex-shrink-0" />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden relative">
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
        <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="fortune" element={<FortuneScreen />} />
            <Route path="greetings" element={<GreetingsScreen />} />
            <Route path="journal" element={<JournalScreen />} />
            <Route path="converter" element={<ConverterScreen />} />
            <Route path="world-clock" element={<WorldClockScreen />} />
            <Route path="prayers" element={<PrayersScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            </Route>
        </Routes>
        </Router>
    </LanguageProvider>
  );
};

export default App;
