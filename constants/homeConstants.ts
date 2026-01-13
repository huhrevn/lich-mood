
import { LocationData, WeatherData } from "../types/homeTypes";

export const DEFAULT_LOCATION: LocationData = {
    lat: 15.0063,
    lon: 108.5716, 
    name: 'Sơn Thủy',
    country: 'Quảng Ngãi'
};

export const DEFAULT_WEATHER: WeatherData = {
    temp: 26,
    feelsLike: 28,
    humidity: 78,
    windSpeed: 12,
    uvIndex: 4,
    weatherCode: 1, 
    isDay: 1,
    visibility: 10,
    pressure: 1010,
    description: "Nhiều mây"
};
