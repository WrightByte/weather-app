import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import WeatherForm from './WeatherForm';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import DetailedWeather from './DetailedWeather';
import FavoriteLocations from './FavoriteLocations';
import { getBackgroundVideo } from '../utils/backgroundSelector';
import '../styles/WeatherApp.css';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [background, setBackground] = useState('clear');
  const [units, setUnits] = useState('imperial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [infoBoxBackground, setInfoBoxBackground] = useState('');

  const updateInfoBoxBackground = (weatherCode) => {
    if (weatherCode <= 3) setInfoBoxBackground('clear');
    else if (weatherCode <= 48) setInfoBoxBackground('cloudy');
    else if (weatherCode <= 67) setInfoBoxBackground('rain');
    else if (weatherCode <= 77) setInfoBoxBackground('snow');
    else if (weatherCode <= 82) setInfoBoxBackground('rain');
    else if (weatherCode <= 86) setInfoBoxBackground('snow');
    else setInfoBoxBackground('thunderstorm');
  };

  const fetchWeather = useCallback(async (lat, lon, locationName, country_code) => {
    const newUnits = country_code === 'US' ? 'imperial' : 'metric';
    setUnits(newUnits);

    const cacheKey = `${lat},${lon},${newUnits}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 600000) {
      setWeatherData(cache[cacheKey].weatherData);
      setForecast(cache[cacheKey].forecast);
      updateBackground(cache[cacheKey].weatherData.weather[0].id);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m,pressure_msl&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`);
      
      // Log API Response for debugging
      console.log('API Response:', response.data);

      const currentIndex = response.data.hourly.time.indexOf(response.data.current_weather.time);

      // Convert temperature from Celsius to Fahrenheit or keep in Celsius
      const convertTemperature = (temp, unit) => unit === 'imperial' ? (temp * 9/5) + 32 : temp;
      // Convert pressure from hPa to inHg
      const convertPressure = (pressure) => pressure * 0.02953; // Convert hPa to inHg

      // Build current weather data with proper conversions
      const currentWeather = {
        main: {
          temp: convertTemperature(response.data.current_weather.temperature, newUnits),
          humidity: response.data.hourly.relativehumidity_2m[currentIndex],
          pressure: convertPressure(response.data.hourly.pressure_msl[currentIndex]),
          temp_max: convertTemperature(response.data.daily.temperature_2m_max[0], newUnits),
          temp_min: convertTemperature(response.data.daily.temperature_2m_min[0], newUnits),
        },
        weather: [{ id: response.data.current_weather.weathercode }],
        wind: { speed: response.data.current_weather.windspeed }, // km/h is correct for API data
        name: locationName,
        sys: {
          sunrise: new Date(response.data.daily.sunrise[0]).toLocaleTimeString('en-US', { timeZone: response.data.timezone }),
          sunset: new Date(response.data.daily.sunset[0]).toLocaleTimeString('en-US', { timeZone: response.data.timezone }),
          country: country_code,
        },
        coord: { lat, lon },
      };

      // Build forecast data with proper conversions
      const forecastData = response.data.daily.time.map((time, index) => ({
        dt_txt: time,
        main: { 
          temp_max: convertTemperature(response.data.daily.temperature_2m_max[index], newUnits),
          temp_min: convertTemperature(response.data.daily.temperature_2m_min[index], newUnits),
        },
        weather: [{ id: response.data.daily.weathercode[index] }],
      })).filter(item => item.weather[0].id !== undefined);

      setWeatherData(currentWeather);
      setForecast(forecastData);
      updateBackground(currentWeather.weather[0].id);

      setCache(prevCache => ({
        ...prevCache,
        [cacheKey]: {
          weatherData: currentWeather,
          forecast: forecastData,
          timestamp: Date.now()
        }
      }));

      updateInfoBoxBackground(currentWeather.weather[0].id);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Your Location", "US");
        },
        error => {
          console.error("Error getting location:", error);
          setError("Couldn't get your location. Please search for a location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please search for a location.");
    }
  }, [fetchWeather]);

  const handleLocationSearch = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
      
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const { lat, lon } = result;
        
        const addressParts = result.display_name.split(', ');
        const country = addressParts[addressParts.length - 1];
        const country_code = result.address && result.address.country_code 
          ? result.address.country_code.toUpperCase() 
          : (country === 'United States' ? 'US' : 'Unknown');
        
        let locationName = addressParts.slice(0, -1).join(', ').trim();

        await fetchWeather(
          parseFloat(lat), 
          parseFloat(lon), 
          locationName,
          country_code
        );
      } else {
        setError("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      setError("Error searching for location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateBackground = (weatherCode) => {
    if (weatherCode <= 3) setBackground('clear');
    else if (weatherCode <= 48) setBackground('cloudy');
    else if (weatherCode <= 67) setBackground('rain');
    else if (weatherCode <= 77) setBackground('snow');
    else if (weatherCode <= 82) setBackground('rain');
    else if (weatherCode <= 86) setBackground('snow');
    else setBackground('thunderstorm');
  };

  const addToFavorites = (location) => {
    setFavorites(prevFavorites => {
      const newFavorite = { name: location.name, lat: location.coord.lat, lon: location.coord.lon };
      const newFavorites = [...prevFavorites, newFavorite];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFromFavorites = (location) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(fav => fav.name !== location.name);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <div className="weather-app">
      <video key={background} autoPlay muted loop id="background-video">
        <source src={getBackgroundVideo(background)} type="video/mp4" />
      </video>
      <div className="content">
        <WeatherForm onSearch={handleLocationSearch} />
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {weatherData && !loading && (
          <>
            <div className={`info-box ${infoBoxBackground}`}>
              <CurrentWeather data={weatherData} units={units} />
              <DetailedWeather data={weatherData} units={units} />
            </div>
            {forecast && <Forecast data={forecast} units={units} />}
            <button onClick={() => addToFavorites(weatherData)} className="favorite-button">Add to Favorites</button>
            <FavoriteLocations 
              favorites={favorites} 
              onSelect={handleLocationSearch} 
              onRemove={removeFromFavorites}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
