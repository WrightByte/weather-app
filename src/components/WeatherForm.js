import React, { useState } from 'react';
import '../styles/WeatherForm.css';

const WeatherForm = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
      setLocation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="weather-form">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        id="location-input"
        placeholder="Enter city name"
        className="search-input"
        aria-label="Enter city name"
      />
      <button type="submit" className="search-button" aria-label="Search for weather">
        Search
      </button>
    </form>
  );
};

export default WeatherForm;
