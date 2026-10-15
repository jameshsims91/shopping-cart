import { useMemo } from 'react'
import { useProducts } from '../../useProducts'
import ProductCard from '../ProductCard'
import styles from './Home.module.css'

const pageSeed = Math.floor(Math.random() * 4294967296)

function getRandomFeaturedProducts(products, seed) {
  const shuffled = [...products]
  let state = seed

  for (let i = shuffled.length - 1; i > 0; i--) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0

    const randomIndex = Math.floor(
      (state / 4294967296) * (i + 1)
    )

    ;[shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ]
  }

  return shuffled.slice(0, 3)
}

function Home() {
  const { products, loading, error } = useProducts()
  const featuredProducts = useMemo(
    () => getRandomFeaturedProducts(products, pageSeed),
    [products]
  )

  if (loading) {
    return (
      <div className={styles.homeContainer}>
        <h1 className={styles.title}>Checkout the Merch!</h1>
        <p role="status">Loading featured products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.homeContainer}>
        <h1 className={styles.title}>Checkout the Merch!</h1>
        <p role="alert">
          Unable to load featured products. Please try again later.
        </p>
      </div>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <div className={styles.homeContainer}>
        <h1 className={styles.title}>Checkout the Merch!</h1>
        <p>No featured products available.</p>
      </div>
    )
  }

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Checkout the Merch!</h1>

      <div className={styles.productGrid}>
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}

export default Home