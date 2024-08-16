import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './Pages/Signup'
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0)

  return (
<>
  <Signup/>
  <Toaster />
</>
  )
}

export default App
