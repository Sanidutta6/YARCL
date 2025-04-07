import { createBrowserRouter, RouterProvider } from "react-router"
import AppLayout from "./layouts/AppLayout"
import Home from "./pages/Home"
import Installation from "./pages/Installation"
import Components from "./pages/Components"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/installation",
        element: <Installation />,
      },
      {
        path: "/components",
        element: <Components />,
      },
      {
        path: "/components/:componentName",
        element: <Components />,
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
