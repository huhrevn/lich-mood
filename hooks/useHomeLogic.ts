import { useState, useEffect, useRef } from 'react';
import { getUserProfile } from '../../services/googleCalendarService';
import { LocationData, WeatherData, SearchResult, UserProfile } from '../../types/homeTypes';
import { DEFAULT_LOCATION, DEFAULT_WEATHER } from '../../constants/homeConstants';
import { SOLAR_HOLIDAYS, LUNAR_HOLIDAYS } from '../../constants/calendarConstants';
import lunisolar from 'lunisolar';

export const useHomeLogic = () => {
    // --- STATE ---
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const [user, setUser] = useState<UserProfile>({
        name: 'Khách',
        avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    });
    const [greeting, setGreeting] = useState('Xin chào');

    // --- LOCATION & WEATHER STATE ---
    const [currentLocation, setCurrentLocation] = useState<LocationData>(DEFAULT_LOCATION);
    const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
    const [loadingWeather, setLoadingWeather] = useState(false);
    
    // --- SEARCH STATE ---
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<any>(null);

    // --- HELPERS ---
    const getWeatherDescription = (code: number) => {
        if (code === 0) return 'Trời quang đãng';
        if (code <= 3) return 'Có mây rải rác';
        if (code <= 48) return 'Sương mù';
        if (code <= 67) return 'Mưa nhỏ';
        if (code <= 77) return 'Mưa tuyết';
        if (code <= 82) return 'Mưa rào';
        if (code <= 99) return 'Giông bão';
        return 'Nhiều mây';
    };

    // --- EFFECTS ---

    // 1. Clock & User & Greeting
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        setGreeting('Xin chào');
        
        const loadUser = () => {
            getUserProfile().then(p => { if (p) setUser(p); }).catch(() => {});
        };
        loadUser();
        
        // Listen for profile updates
        window.addEventListener('user_profile_updated', loadUser);

        return () => { 
            clearInterval(timer);
            window.removeEventListener('user_profile_updated', loadUser);
        }
    }, []);

    // 2. AUTO DETECT LOCATION
    useEffect(() => {
        const detectLocation = async () => {
            setLoadingWeather(true);
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            try {
                                const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`);
                                if (!geoRes.ok) throw new Error("Geo fetch failed");
                                const geoData = await geoRes.json();
                                const name = geoData.locality || geoData.city || geoData.principalSubdivision || "Vị trí của bạn";
                                
                                setCurrentLocation({
                                    lat: latitude,
                                    lon: longitude,
                                    name: name,
                                    country: geoData.countryName || "Việt Nam"
                                });
                            } catch (e) {
                                setCurrentLocation({ ...DEFAULT_LOCATION, lat: latitude, lon: longitude });
                            }
                        },
                        async () => { await fallbackToIpLocation(); },
                        { timeout: 5000 }
                    );
                } else {
                    await fallbackToIpLocation();
                }
            } catch (e) { 
                await fallbackToIpLocation();
            }
        };

        const fallbackToIpLocation = async () => {
            try {
                const res = await fetch('https://ipwho.is/');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setCurrentLocation({
                            lat: data.latitude,
                            lon: data.longitude,
                            name: data.city || data.region,
                            country: data.country
                        });
                    }
                }
            } catch (e) { 
                console.warn("IP Geolocation failed", e);
            }
        };
        detectLocation();
    }, []);

    // 3. FETCH WEATHER
    useEffect(() => {
        let isMounted = true;
        const fetchW = async () => {
            if (!currentLocation) return;
            setLoadingWeather(true);
            try {
                 const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,visibility,surface_pressure&timezone=auto`);
                 if(res.ok && isMounted) {
                     const data = await res.json();
                     setWeather({
                         temp: Math.round(data.current.temperature_2m),
                         feelsLike: Math.round(data.current.apparent_temperature),
                         humidity: data.current.relative_humidity_2m,
                         windSpeed: Math.round(data.current.wind_speed_10m),
                         uvIndex: 5,
                         visibility: data.current.visibility ? Math.round(data.current.visibility / 1000) : 10,
                         pressure: Math.round(data.current.surface_pressure),
                         weatherCode: data.current.weather_code,
                         isDay: data.current.is_day,
                         description: getWeatherDescription(data.current.weather_code)
                     });
                 }
            } catch (e) { 
                console.error("Weather fetch failed", e);
            }
            if(isMounted) setLoadingWeather(false);
        };
        fetchW();
        return () => { isMounted = false; };
    }, [currentLocation]);

    // 4. SEARCH LOGIC
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        
        if (searchQuery.trim().length > 1) {
            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(async () => {
                const query = searchQuery.toLowerCase();
                let newResults: SearchResult[] = [];
                const currentYear = new Date().getFullYear();

                Object.entries(SOLAR_HOLIDAYS).forEach(([key, def]) => {
                    if (def.name.toLowerCase().includes(query)) {
                        const [d, m] = key.split('-').map(Number);
                        newResults.push({
                            id: `solar-${key}`,
                            type: 'HOLIDAY',
                            name: def.name,
                            description: `Ngày ${d}/${m} Dương lịch`,
                            date: new Date(currentYear, m - 1, d)
                        });
                    }
                });

                Object.entries(LUNAR_HOLIDAYS).forEach(([key, def]) => {
                    if (def.name.toLowerCase().includes(query)) {
                        const [d, m] = key.split('-').map(Number);
                        let scanDate = new Date(currentYear, 0, 1);
                        for(let i=0; i<366; i++) {
                             if (scanDate.getFullYear() < 1900 || scanDate.getFullYear() > 2100) {
                                 scanDate.setDate(scanDate.getDate() + 1);
                                 continue;
                             }
                             try {
                                 const l = lunisolar(scanDate);
                                 if(l.lunar.day === d && l.lunar.month === m) {
                                     newResults.push({
                                        id: `lunar-${key}`,
                                        type: 'HOLIDAY',
                                        name: def.name,
                                        description: `Ngày ${d}/${m} Âm lịch`,
                                        date: new Date(scanDate)
                                    });
                                    break;
                                 }
                             } catch(e){}
                             scanDate.setDate(scanDate.getDate() + 1);
                        }
                    }
                });

                const dateMatch = query.match(/^(\d{1,2})[./-](\d{1,2})(.*)$/);
                if (dateMatch) {
                    const d = parseInt(dateMatch[1]);
                    const m = parseInt(dateMatch[2]);
                    const suffix = dateMatch[3].trim();
                    const isLunar = ['am', 'âm', 'al', 'lunar'].some(s => suffix.includes(s));

                    if (d > 0 && d <= 31 && m > 0 && m <= 12) {
                        if (isLunar) {
                             let scanDate = new Date(currentYear, 0, 1);
                             for(let i=0; i<380; i++) {
                                 if (scanDate.getFullYear() < 1900 || scanDate.getFullYear() > 2100) {
                                     scanDate.setDate(scanDate.getDate() + 1);
                                     continue;
                                 }
                                 try {
                                     const l = lunisolar(scanDate);
                                     if(l.lunar.day === d && l.lunar.month === m) {
                                         newResults.push({
                                            id: `date-lunar-${d}-${m}`,
                                            type: 'DATE',
                                            name: `Ngày ${d}/${m} Âm lịch`,
                                            description: `Tương ứng ${scanDate.getDate()}/${scanDate.getMonth()+1} Dương lịch`,
                                            date: new Date(scanDate)
                                        });
                                        break;
                                     }
                                 } catch(e){}
                                 scanDate.setDate(scanDate.getDate() + 1);
                             }
                        } else {
                            const date = new Date(currentYear, m - 1, d);
                            newResults.push({
                                id: `date-solar-${d}-${m}`,
                                type: 'DATE',
                                name: `Ngày ${d}/${m}`,
                                description: `Lịch ngày ${d}/${m}/${currentYear}`,
                                date: date
                            });
                        }
                    }
                }

                try {
                    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=vi&format=json`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.results) {
                             const locResults = data.results.map((item: any) => ({
                                id: item.id,
                                type: 'LOCATION',
                                name: item.name,
                                admin1: item.admin1,
                                country: item.country,
                                latitude: item.latitude,
                                longitude: item.longitude,
                                feature_code: item.feature_code
                             }));
                             newResults = [...newResults, ...locResults];
                        }
                    }
                } catch (e) { console.error(e); }

                newResults.sort((a, b) => {
                    const typeScore = (t: string) => t === 'HOLIDAY' ? 0 : t === 'DATE' ? 1 : 2;
                    return typeScore(a.type) - typeScore(b.type);
                });

                setSearchResults(newResults.slice(0, 8));
                setIsSearching(false);
            }, 500);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchQuery]);

    const handleSelectResult = (result: SearchResult) => {
        if (result.type === 'LOCATION') {
            setCurrentLocation({
                lat: result.latitude!,
                lon: result.longitude!,
                name: result.name,
                country: result.country || "Việt Nam"
            });
        } else if ((result.type === 'HOLIDAY' || result.type === 'DATE') && result.date) {
            setSelectedDate(new Date(result.date));
        }
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return {
        state: {
            currentTime,
            selectedDate,
            user,
            greeting,
            currentLocation,
            weather,
            loadingWeather,
            isSearchOpen,
            searchQuery,
            searchResults,
            isSearching
        },
        actions: {
            setSelectedDate,
            setIsSearchOpen,
            setSearchQuery,
            setSearchResults,
            handleSelectLocation: handleSelectResult
        }
    };
};