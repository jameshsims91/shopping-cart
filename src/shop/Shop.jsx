import styles from './Shop.module.css'

const Shop = () => {
  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.title}>Welcome to the Shop</h1>
      <p className={styles.text}>Browse our awesome products here!</p>
    </div>
  )
}

export default Shop;