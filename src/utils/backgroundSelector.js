import clearVideo from '../assets/clear.mp4';
import rainVideo from '../assets/rain.mp4';
import snowVideo from '../assets/snow.mp4';
import cloudyVideo from '../assets/cloudy.mp4';
import thunderstormVideo from '../assets/thunderstorm.mp4';

export const getBackgroundVideo = (weather) => {
  switch (weather) {
    case 'clear':
      return clearVideo;
    case 'rain':
    case 'drizzle':
      return rainVideo;
    case 'snow':
      return snowVideo;
    case 'clouds':
      return cloudyVideo;
    case 'thunderstorm':
      return thunderstormVideo;
    default:
      return clearVideo;
  }
};
