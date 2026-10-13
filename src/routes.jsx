import { createBrowserRouter } from 'react-router'
import App from './App'
import Home from './home/Home'
import Shop from './shop/Shop'
import Cart from './cart/Cart'
import ErrorPage from './error/ErrorPage'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'cart', element: <Cart /> },
    ]
  }
])

export default routes;