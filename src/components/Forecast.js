import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

const Forecast = ({ data, units }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="forecast">
      <h3>7-Day Forecast</h3>
      <div className="forecast-scroll">
        {data.map((item, index) => {
          const { icon, color } = getWeatherIcon(item.weather[0].id);
          return (
            <div key={index} className="forecast-item">
              <div>{new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}</div>
              <i className={`wi ${icon} weather-icon ${color}`}></i>
              <div>
                {Math.round(item.main.temp_max)}°/{Math.round(item.main.temp_min)}°
                {units === 'imperial' ? 'F' : 'C'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
