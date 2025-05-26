import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import EnergyChart from './EnergyChart'


function App() {
  const [count, setCount] = useState(0)
  let data: number | {}[] = 0 // Placeholder for your data, e.g., fetched from an API
  useEffect(() => {
    // Simulate fetching data
    data = [
      { hour: '00:00', demand: 100, generation: 80, forecast: 90 },
      { hour: '01:00', demand: 110, generation: 85, forecast: 95 },
      { hour: '02:00', demand: 120, generation: 90, forecast: 100 },
      { hour: '03:00', demand: 130, generation: 95, forecast: 105 },
      { hour: '04:00', demand: 140, generation: 100, forecast: 110 },
      { hour: '05:00', demand: 150, generation: 105, forecast: 115 }]

    // setTimeout(() => {
    //   // Simulate an API call delay
    //   console.log('Data fetched:', data)
    //   // Here you would typically set the state with the fetched data
    // }, 1000)
    console.log('Data:', data)
  }, [])

  console.log('Data:', data)


  return (
    <>
      <div className='bg-gray-100 flex justify-center items-center h-screen'>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        pnpm.cmd add -D @tanstack/router-plugin

      </div>
      <h1>Vite + React</h1>
      {/* <EnergyChart rawAPIData={[
        { hour: '00:00', demand: 100, generation: 80, forecast: 90 },
        { hour: '01:00', demand: 110, generation: 85, forecast: 95 },
        { hour: '02:00', demand: 120, generation: 90, forecast: 100 },
        { hour: '03:00', demand: 130, generation: 95, forecast: 105 },
        { hour: '04:00', demand: 140, generation: 100, forecast: 110 },
        { hour: '05:00', demand: 150, generation: 105, forecast: 115 },
      ]} /> */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
