import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';
import '../styles/CurrentWeather.css';

const CurrentWeather = ({ data, units }) => {
  if (!data) return null;

  const { icon, color } = getWeatherIcon(data.weather[0].id);

  return (
    <div className="current-weather">
      <h2>{data.name}</h2>
      <div className="temperature">
        {Math.round(data.main.temp)}°{units === 'imperial' ? 'F' : 'C'}
      </div>
      <i className={`wi ${icon} weather-icon ${color}`}></i>
      <div className="description">{data.weather[0].description}</div>
      <div className="high-low">
        H: {Math.round(data.main.temp_max)}° L: {Math.round(data.main.temp_min)}°
      </div>
    </div>
  );
};

export default CurrentWeather;
