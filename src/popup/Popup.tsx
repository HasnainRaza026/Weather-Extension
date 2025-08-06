import { AppWindow, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCoordsByCity } from '../api/locationApis';
import { getWeatherData } from '../api/weatherApis';

interface CityTemp {
  city: string;
  lat: string;
  lon: string;
  temperature: string;
}

function Popup() {
  const [cityTemps, setCityTemps] = useState<CityTemp[]>([]);
  const [inputCity, setInputCity] = useState('');
  const [temp, setTemp] = useState('C');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['showOverlay', 'cityTemps'], (result) => {
      setShowOverlay(result.showOverlay);
      setCityTemps(result.cityTemps || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputCity.trim() === '') return;
    // console.log(`Fetching weather for: ${inputCity}`);

    try {
      const coords = await getCoordsByCity(inputCity);
      if (coords) {
        const weatherData = await getWeatherData({
          lat: coords.lat,
          lng: coords.lng,
        });
        if (weatherData) {
          chrome.storage.local.get(['cityTemps'], (result) => {
            const updatedCityTemps = [
              ...result.cityTemps,
              {
                city: coords.city,
                lat: coords.lat,
                lon: coords.lng,
                temperature: weatherData.temperature,
              },
            ];
            chrome.storage.local.set({ cityTemps: updatedCityTemps }, () => {
              setCityTemps(updatedCityTemps);
            });
          });
        } else {
          throw new Error('Could not fetch weather data for the city');
        }
      } else {
        throw new Error('Could not fetch coordinates for the city');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    setInputCity('');
  };

  const handleOverlayToggle = () => {
    chrome.storage.local.set({ showOverlay: !showOverlay });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-overlay' }, () => {
        setShowOverlay((prev) => !prev);
      });
    });
  };

  return (
    <div className='w-[300px] h-[400px] p-4 overflow-scroll overflow-x-hidden '>
      <div className='flex justify-between mb-4'>
        <form onSubmit={handleSubmit} className='flex gap-1.5 w-2/3'>
          <input
            className='p-2 border border-gray-400 rounded w-full'
            type='text'
            value={inputCity}
            placeholder='Enter city name'
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button type='submit' className='p-2 bg-blue-500 text-white rounded'>
            <Plus />
          </button>
        </form>
        <button
          className='p-2 border border-gray-500 rounded text-xl'
          onClick={() => (temp === 'C' ? setTemp('F') : setTemp('C'))}
        >
          {temp === 'C' ? '°C' : '°F'}
        </button>
        <button
          className={`p-2 border border-gray-500 rounded ${
            showOverlay ? 'bg-gray-200' : ''
          }`}
          onClick={handleOverlayToggle}
        >
          <AppWindow className='text-gray-500' />
        </button>
      </div>

      {cityTemps.length === 0 ? (
        <p className='text-center text-gray-500'>No cities added yet.</p>
      ) : (
        <div className='flex flex-col gap-2'>
          {cityTemps.map((cityTemp) => (
            <div
              key={cityTemp.city}
              className='p-4 rounded bg-white border border-gray-300'
            >
              <div className='flex flex-col items-center justify-between'>
                <p className='text-lg'>{cityTemp.city}</p>
                <p className='text-3xl'>{cityTemp.temperature}°C</p>
              </div>
              <button className='text-red-800'>DELETE</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Popup;
