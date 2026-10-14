import { Link } from 'react-router'
import styles from './ErrorPage.module.css'

const ErrorPage = () => {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorCard}>
        <span className={styles.errorBadge}>ERROR 404</span>

        <div className={styles.errorNumber} aria-hidden="true">
          404
        </div>

        <h1 className={styles.title}>
          YOU'VE LEFT THE SHOP
        </h1>

        <p className={styles.message}>
          Looks like you've wandered beyond the bounds of our merch shop.
          The page you're looking for doesn't exist or has moved.
        </p>

        <div className={styles.actions}>
          <Link to="/shop" className={styles.shopButton}>
            Explore the Shop
            <span aria-hidden="true"> →</span>
          </Link>

          <Link to="/" className={styles.homeLink}>
            Return Home
          </Link>
        </div>

        <p className={styles.footerText}>
          LOST IN THE VOID? YOUR NEXT FAVORITE MERCH IS JUST A CLICK AWAY.
        </p>
      </div>
    </div>
  )
}

export default ErrorPage
