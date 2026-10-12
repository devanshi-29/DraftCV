import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import Builder from './pages/Builder';

function App() {
  const router=createBrowserRouter([
       {
        path:"/",
        element:<Home />
       },

       {
         path:"/builder",
         element:<Builder />
        }
  ])
  return (
      <RouterProvider router={router}/>
  )
}

export default App
