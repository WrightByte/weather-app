export const getWeatherIcon = (code) => {
    if (code <= 3) return { icon: 'wi-day-sunny', color: 'yellow' };
    if (code <= 48) return { icon: 'wi-cloudy', color: 'gray' };
    if (code <= 55) return { icon: 'wi-rain-mix', color: 'light-blue' };
    if (code <= 57) return { icon: 'wi-rain', color: 'blue' };
    if (code <= 65) return { icon: 'wi-showers', color: 'dark-blue' };
    if (code <= 67) return { icon: 'wi-rain', color: 'blue' };
    if (code <= 77) return { icon: 'wi-snow', color: 'white' };
    if (code <= 82) return { icon: 'wi-rain', color: 'blue' };
    if (code <= 86) return { icon: 'wi-snow', color: 'white' };
    if (code <= 99) return { icon: 'wi-thunderstorm', color: 'orange' };
    return { icon: 'wi-na', color: 'gray' };
  };
  