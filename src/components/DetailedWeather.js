import React from 'react';
import '../styles/DetailedWeather.css';

const DetailedWeather = ({ data, units }) => {
  if (!data) return null;

  const formatTime = (timeString, timezone) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="detailed-weather">
      <div className="detail-item">
        <i className="wi wi-humidity"></i>
        <span>Humidity: {data.main.humidity}%</span>
      </div>
      <div className="detail-item">
        <i className="wi wi-barometer"></i>
        <span>Pressure: {data.main.pressure} hPa</span>
      </div>
      <div className="detail-item">
        <i className="wi wi-strong-wind"></i>
        <span>Wind: {Math.round(data.wind.speed)} {units === 'imperial' ? 'mph' : 'm/s'}</span>
      </div>
      <div className="detail-item">
        <i className="wi wi-sunrise"></i>
        <span>Sunrise: {formatTime(data.sys.sunrise, data.timezone)}</span>
      </div>
      <div className="detail-item">
        <i className="wi wi-sunset"></i>
        <span>Sunset: {formatTime(data.sys.sunset, data.timezone)}</span>
      </div>
    </div>
  );
};

export default DetailedWeather;