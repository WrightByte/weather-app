import React from 'react';
import '../styles/DetailedWeather.css';

const DetailedWeather = ({ data, units }) => {
  if (!data) return null;

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
        <span>Wind: {data.wind.speed} {units === 'imperial' ? 'mph' : 'm/s'}</span>
      </div>
      <div className="detail-item">
        <i className="wi wi-sunrise"></i>
        <span>Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</span>
      </div>
      <div className="detail-item">
        <i className="wi wi-sunset"></i>
        <span>Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default DetailedWeather;
