const apiKey = import.meta.env.VITE_API_KEY;

export async function getWeatherData(coords: {
  lat: string;
  lng: string;
  units?: string;
}) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${
        coords.lng
      }&units=${coords.units || 'metric'}&appid=${apiKey}`
    );
    const data = await resp.json();
    if (data.cod !== 200) {
      console.warn('Weather API error:', data.message);
      return false;
    }
    return {
      temperature: data.main.temp,
    };
  } catch (err) {
    console.error('Weather API fetch failed', err);
    return false;
  }
}
