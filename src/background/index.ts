import { getUserCity } from '../api/locationApis';
import { getWeatherData } from '../api/weatherApis';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.clear();
  }

  const city = await getUserCity();
  if (city) {
    const weatherData = await getWeatherData({
      lat: city.lat,
      lng: city.lon,
    });
    if (weatherData) {
      chrome.storage.local.set({
        cityTemps: [
          {
            city: city.city,
            lat: city.lat,
            lon: city.lon,
            temperature: weatherData.temperature,
          },
        ],
      });
    } else {
      chrome.storage.local.set({
        cityTemps: [],
      });
    }
  } else {
    chrome.storage.local.set({
      cityTemps: [],
    });
  }

  chrome.storage.local.set({
    showOverlay: false,
  });
});
