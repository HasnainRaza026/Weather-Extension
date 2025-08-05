import { useEffect, useState } from 'react';
import './index.css';

export default function ContentScript() {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['showOverlay'], (result) => {
      setIsShown(result.showOverlay);
    });
  }, []);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle-overlay') {
      console.log('Toggling overlay visibility');
      chrome.storage.local.get(['showOverlay'], (result) => {
        setIsShown(result.showOverlay);
      });
      sendResponse();
    }
  });

  return (
    <div className='container' style={{ display: isShown ? 'block' : 'none' }}>
      <h1 className='title'>Hyderabad</h1>
      <p className='temperature'>25°C</p>
    </div>
  );
}
