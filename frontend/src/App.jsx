import { useState } from 'react'
import LandPage from './components/landingPage/Landpage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandPage />
    </>
  )
}

export default App
