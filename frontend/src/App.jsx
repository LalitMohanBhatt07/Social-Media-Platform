import { useState } from 'react'
import { createBrowserRouter } from 'react-router-dom';
import './App.css'
import Signup from './Pages/Signup.jsx'
import toast, { Toaster } from 'react-hot-toast';
import Login from './Pages/Login';
import { RouterProvider } from 'react-router-dom';

import Home from './components/Home.jsx';
import MainComponent from './components/MainComponent.jsx';
import Profile from './components/ui/Profile';

const browserRouter=createBrowserRouter([
  {
   path:"/",
   element:<MainComponent/>,
   children:[
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/profile",
      element:<Profile/>
    }
  ]
},
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:'/login',
      element:<Login/>
    }
])

function App() {
  const [count, setCount] = useState(0)

  return (
<>
  <RouterProvider router={browserRouter}/>
</>
  )
}

export default App
