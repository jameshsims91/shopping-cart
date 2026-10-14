import { Outlet } from 'react-router'
import NavBar from './nav-bar/NavBar'
import { CartProvider } from './CartProvider'
import './App.css';

const App = () => {
  return (
    <CartProvider>
      <div className='app-container'>
        <NavBar />

        <main className='main-content'>
          <Outlet />
        </main>
      </div>
    </CartProvider>
  )
}

export default App