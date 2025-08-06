import { getUserCity } from '../api/locationApis';
import { getWeatherData } from '../api/weatherApis';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.clear();
  }

  const city = await getUserCity();
  if (city) {
    const weatherDataCel = await getWeatherData({
      lat: city.lat,
      lng: city.lon,
      units: 'metric',
    });
    const weatherDataFrn = await getWeatherData({
      lat: city.lat,
      lng: city.lon,
      units: 'imperial',
    });
    if (weatherDataCel && weatherDataFrn) {
      chrome.storage.local.set({
        cityTempsCel: [
          {
            city: city.city,
            lat: city.lat,
            lon: city.lon,
            temperature: weatherDataCel.temperature,
          },
        ],
        cityTempsFrn: [
          {
            city: city.city,
            lat: city.lat,
            lon: city.lon,
            temperature: weatherDataFrn.temperature,
          },
        ],
      });
    } else {
      chrome.storage.local.set({
        cityTempsCel: [],
        cityTempsFrn: [],
      });
    }
  } else {
    chrome.storage.local.set({
      cityTempsCel: [],
      cityTempsFrn: [],
    });
  }

  chrome.storage.local.set({
    showOverlay: false,
    unit: 'C',
  });
});
