import { useState } from 'react'
import { useCart } from '../../useCart'
import Products from '../Products'
import styles from './Home.module.css'

function Home() {
  const { addToCart } = useCart()
  const [quantities, setQuantities] = useState({})

  const featuredProducts = Products
    .filter((product) => product.featured)
    .slice(0, 3)

  const handleQuantityChange = (id, quantity) => {
    setQuantities((current) => ({
      ...current,
      [id]: quantity,
    }))
  }

  const handleAddToCart = (product) => {
    const quantity = Number(quantities[product.id] || 1)

    addToCart(product, quantity)

    setQuantities((current) => ({
      ...current,
      [product.id]: 1,
    }))
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

            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={quantities[product.id] ?? 1}
                onChange={(event) =>
                  handleQuantityChange(
                    product.id,
                    Math.max(1, Number(event.target.value) || 1)
                  )
                }
              />
            </label>

            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Home
