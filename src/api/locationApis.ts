const apiKey = import.meta.env.VITE_API_KEY;

export async function getUserCity() {
  try {
    const resp = await fetch('http://ip-api.com/json/?fields=61439');
    const data = await resp.json();
    if (data.status === 'success' && data.city) {
      return { city: data.city, lat: data.lat, lon: data.lon };
    } else {
      console.warn('Could not fetch city');
      return false;
    }
  } catch (err) {
    console.error('Geolocation fetch failed', err);
    return false;
  }
}

export async function getCoordsByCity(city: string) {
  try {
    const resp = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    );
    const data = await resp.json();
    if (data.length > 0) {
      return { city: data[0].name, lat: data[0].lat, lng: data[0].lon };
    } else {
      console.warn('Could not fetch coordinates for city:', city);
      return false;
    }
  } catch (err) {
    console.error('Geolocation fetch failed for city', err);
    return false;
  }
}
