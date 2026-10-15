import styles from './Shop.module.css'
import { useProducts } from '../../useProducts'
import ProductCard from '../ProductCard'

const Shop = () => {
  const { products, loading, error } = useProducts()

  if (loading) {
    return (
      <div className={styles.shopContainer}>
        <h1 className={styles.title}>Welcome to the Shop</h1>
        <p role='status'>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.shopContainer}>
        <h1 className={styles.title}>Welcome to the Shop</h1>
        <p role='alert'>Unable to load products. Please try again later.</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={styles.shopContainer}>
        <h1 className={styles.title}>Wlecome to the Shop</h1>
        <p>No products available.</p>
      </div>
    )
  }

  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.title}>Welcome to the Shop</h1>
      <p className={styles.text}>Browse our awesome products here!</p>

      <div className={styles.merchGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}

export default Shop