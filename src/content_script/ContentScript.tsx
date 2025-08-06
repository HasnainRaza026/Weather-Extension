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
    chrome.storage.local.get(['showOverlay', 'cityTemps'], (result) => {
      setIsShown(result.showOverlay);
      setCityTemp(result.cityTemps || []);
    });
  }, []);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
      <p className='temperature'>{cityTemp[0].temperature}°C</p>
    </div>
  );
}
