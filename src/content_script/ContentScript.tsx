import { useEffect, useState } from 'react';
import './index.css';

interface CityTemp {
  city: string;
  lat: string;
  lon: string;
  temperature: string;
}

export default function ContentScript() {
  const [cityTemp, setCityTemp] = useState<CityTemp[]>([]);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(
      ['showOverlay', 'cityTempsCel', 'cityTempsFrn', 'unit'],
      (result) => {
        setIsShown(result.showOverlay);
        if (result.unit === 'C') {
          setCityTemp(result.cityTempsCel || []);
        } else {
          setCityTemp(result.cityTempsFrn || []);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (isShown) {
      chrome.storage.local.get(
        ['cityTempsCel', 'cityTempsFrn', 'unit'],
        (result) => {
          if (result.unit === 'C') {
            setCityTemp(result.cityTempsCel || []);
          } else {
            setCityTemp(result.cityTempsFrn || []);
          }
        }
      );
    }
  }, [isShown]);

  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === 'toggle-overlay') {
      chrome.storage.local.get(['showOverlay'], (result) => {
        setIsShown(result.showOverlay);
      });
      sendResponse();
    }
  });

  if (cityTemp.length === 0) {
    return (
      <div
        className='container'
        style={{ display: isShown ? 'block' : 'none' }}
      >
        <h1 className='title'>Empty, add city</h1>
      </div>
    );
  }

  return (
    <div className='container' style={{ display: isShown ? 'block' : 'none' }}>
      <h1 className='title'>{cityTemp[0].city}</h1>
      <p className='temperature'>{cityTemp[0].temperature}°</p>
    </div>
  );
}
