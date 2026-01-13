
export interface LocationData {
    lat: number;
    lon: number;
    name: string;
    country: string;
}

export interface SearchResult {
    id: string | number;
    type: 'LOCATION' | 'HOLIDAY' | 'DATE';
    name: string;
    // Location props
    admin1?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    feature_code?: string;
    population?: number;
    // Date/Event props
    date?: Date;
    description?: string;
}

export interface WeatherData {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    weatherCode: number;
    isDay: number;
    visibility: number;
    pressure: number;
    description: string;
}

export interface UserProfile {
    name: string;
    avatar: string;
}
