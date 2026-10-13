import { Link } from 'react-router'
import styles from './NavBar.module.css'

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><Link to='/' className={styles.noUnderline}>Home</Link></li>
        <li className={styles.navItem}><Link to='/shop' className={styles.noUnderline}>Shop</Link></li>
        <li className={styles.navItem}><Link to='/cart' className={styles.noUnderline}>Cart</Link></li>
      </ul>
    </nav>
  )
}

export default NavBar;
