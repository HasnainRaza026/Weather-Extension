import { AppWindow, Plus } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [inputCity, setInputCity] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputCity.trim() === '') return;
    console.log(`Fetching weather for: ${inputCity}`);
    setInputCity('');
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
        <button className='p-2 border border-gray-500 rounded text-xl'>
          °C
        </button>
        <button className='p-2 border border-gray-500 rounded'>
          <AppWindow className='text-gray-500' />
        </button>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='p-4 rounded bg-white border border-gray-300'>
          <div className='flex flex-col items-center justify-between'>
            <p className='text-lg'>Hyderabad</p>
            <p className='text-3xl'>25°C</p>
          </div>
        </div>

        <div className='p-4 rounded bg-white border border-gray-300'>
          <div className='flex flex-col items-center justify-between'>
            <p className='text-lg'>Hyderabad</p>
            <p className='text-3xl'>25°C</p>
          </div>
          <button className='text-red-800'>DELETE</button>
        </div>
        <div className='p-4 rounded bg-white border border-gray-300'>
          <div className='flex flex-col items-center justify-between'>
            <p className='text-lg'>Hyderabad</p>
            <p className='text-3xl'>25°C</p>
          </div>
          <button className='text-red-800'>DELETE</button>
        </div>
        <div className='p-4 rounded bg-white border border-gray-300'>
          <div className='flex flex-col items-center justify-between'>
            <p className='text-lg'>Hyderabad</p>
            <p className='text-3xl'>25°C</p>
          </div>
          <button className='text-red-800'>DELETE</button>
        </div>
        <div className='p-4 rounded bg-white border border-gray-300'>
          <div className='flex flex-col items-center justify-between'>
            <p className='text-lg'>Hyderabad</p>
            <p className='text-3xl'>25°C</p>
          </div>
          <button className='text-red-800'>DELETE</button>
        </div>
        <div className='p-4 rounded bg-white border border-gray-300'>
          <div className='flex flex-col items-center justify-between'>
            <p className='text-lg'>Hyderabad</p>
            <p className='text-3xl'>25°C</p>
          </div>
          <button className='text-red-800'>DELETE</button>
        </div>
      </div>
    </div>
  );
}

export default App;
