import { useMemo, useState } from 'react'
import { useCart } from '../../useCart'
import { useProducts } from '../../useProducts'
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
  const { addToCart } = useCart()
  const { products, loading, error } = useProducts()

  const [quantities, setQuantities] = useState({})

  const featuredProducts = useMemo(
    () => getRandomFeaturedProducts(products, pageSeed),
    [products]
  )

  const changeQuantity = (id, value) => {
    const amount = Math.max(0, Math.floor(Number(value) || 0))

    setQuantities((previous) => ({
      ...previous,
      [id]: amount,
    }))
  }

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 0

    if (quantity === 0) return

    addToCart(product, quantity)
    changeQuantity(product.id, 0)
  }

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
          <article className={styles.productCard} key={product.id}>
            <img
              className={styles.productImage}
              src={product.image}
              alt={product.name}
            />

            <h2>{product.name}</h2>

            <p>${product.price.toFixed(2)}</p>

            <div className={styles.quantityControls}>
              <button
                type='button'
                className={styles.quantityBtn}
                disabled={!quantities[product.id]}
                onClick={() =>
                  changeQuantity(
                    product.id,
                    (quantities[product.id] || 0) -1
                  )
                }
                aria-label={`Decrease ${product.name} quantity`}
              >
                -
              </button>

              <input
                className={styles.quantityInput}
                type='number'
                min='0'
                step='1'
                value={quantities[product.id] || 0}
                onChange={(e) => 
                  changeQuantity(product.id, e.target.value)
                }
                aria-label={`${product.name} quantity`}
              />

              <button
                type='button'
                className={styles.quantityBtn}
                onClick={() =>
                  changeQuantity(
                    product.id,
                    (quantities[product.id] || 0) + 1
                  )
                }
                aria-label={`Increase ${product.name} quantity`}
              >
                +
              </button>
            </div>

            <button
              type='button'
              className={styles.addToCartBtn}
              disabled={!quantities[product.id]}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Home