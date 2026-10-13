import { Outlet } from 'react-router'
import NavBar from './nav-bar/NavBar'
import './App.css';

const App = () => {
  return (
    <div className='app-container'>
      <NavBar />

      <main className='main-content'>
        <Outlet />
      </main>
    </div>
  )
}

export default App