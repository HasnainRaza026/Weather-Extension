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
  const [unit, setUnit] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(
      ['showOverlay', 'cityTempsCel', 'cityTempsFrn', 'unit'],
      (result) => {
        setShowOverlay(result.showOverlay);
        setUnit(result.unit);
        if (result.unit === 'C') {
          setCityTemps(result.cityTempsCel || []);
        } else {
          setCityTemps(result.cityTempsFrn || []);
        }
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputCity.trim() === '') return;

    try {
      const coords = await getCoordsByCity(inputCity);
      if (coords) {
        const weatherDataCel = await getWeatherData({
          lat: coords.lat,
          lng: coords.lng,
          units: 'metric',
        });
        const weatherDataFrn = await getWeatherData({
          lat: coords.lat,
          lng: coords.lng,
          units: 'imperial',
        });
        if (weatherDataCel && weatherDataFrn) {
          chrome.storage.local.get(
            ['cityTempsCel', 'cityTempsFrn'],
            (result) => {
              chrome.storage.local.set(
                {
                  cityTempsCel: [
                    ...result.cityTempsCel,
                    {
                      city: coords.city,
                      lat: coords.lat,
                      lon: coords.lng,
                      temperature: weatherDataCel.temperature,
                    },
                  ],
                  cityTempsFrn: [
                    ...result.cityTempsFrn,
                    {
                      city: coords.city,
                      lat: coords.lat,
                      lon: coords.lng,
                      temperature: weatherDataFrn.temperature,
                    },
                  ],
                },
                () => {
                  chrome.storage.local.get(
                    unit === 'C' ? 'cityTempsCel' : 'cityTempsFrn',
                    (result) => {
                      setCityTemps(
                        result[unit === 'C' ? 'cityTempsCel' : 'cityTempsFrn']
                      );
                    }
                  );
                }
              );
            }
          );
        } else {
          throw new Error('Could not fetch weather data for the city');
        }
      } else {
        throw new Error('Could not fetch coordinates for the city');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setInputCity('');
      // chrome.storage.local.get(
      //   unit === 'C' ? 'cityTempsCel' : 'cityTempsFrn',
      //   (result) => {
      //     setCityTemps(result[unit === 'C' ? 'cityTempsCel' : 'cityTempsFrn']);
      //   }
      // );
      console.log('hi');
    }
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

  const handleDeleteCity = (city: string) => {
    chrome.storage.local.get(['cityTempsCel', 'cityTempsFrn'], (result) => {
      const updatedCityTempsCel = result.cityTempsCel.filter(
        (ct: CityTemp) => ct.city !== city
      );
      const updatedCityTempsFrn = result.cityTempsFrn.filter(
        (ct: CityTemp) => ct.city !== city
      );
      chrome.storage.local.set(
        {
          cityTempsCel: updatedCityTempsCel,
          cityTempsFrn: updatedCityTempsFrn,
        },
        () => {
          setCityTemps(
            unit === 'C' ? updatedCityTempsCel : updatedCityTempsFrn
          );
        }
      );
    });
  };

  const handleUnitChange = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    chrome.storage.local.set({ unit: newUnit }, () => {
      setUnit(newUnit);
      chrome.storage.local.get(
        newUnit === 'C' ? 'cityTempsCel' : 'cityTempsFrn',
        (result) => {
          setCityTemps(
            result[newUnit === 'C' ? 'cityTempsCel' : 'cityTempsFrn']
          );
        }
      );
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
          onClick={handleUnitChange}
        >
          {unit === 'C' ? '°C' : '°F'}
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
                <p className='text-3xl'>
                  {cityTemp.temperature}°{unit}
                </p>
              </div>
              <button
                className='text-red-800'
                onClick={() => handleDeleteCity(cityTemp.city)}
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Popup;
