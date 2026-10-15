import { useState } from 'react'
import { useCart } from '../useCart'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(0)
  const { addToCart } = useCart()

  const changeQuantity = (value) => {
    const amount = Math.max(0, Math.floor(Number(value) || 0))
    setQuantity(amount)
  }

  const handleAddToCart = () => {
    if (quantity === 0) return

    addToCart(product, quantity)
    setQuantity(0)
  }

  return (
    <article className={styles.productCard}>
      <img
        className={styles.productImage}
        src={product.image}
        alt={product.name}
      />

      <h2 className={styles.productName}>{product.name}</h2>

      <p className={styles.productPrice}>
        ${product.price.toFixed(2)}
      </p>

      <div className={styles.quantityControls}>
        <button
          type="button"
          className={styles.quantityBtn}
          disabled={quantity === 0}
          onClick={() => changeQuantity(quantity - 1)}
          aria-label={`Decrease ${product.name} quantity`}
        >
          −
        </button>

        <input
          className={styles.quantityInput}
          type="number"
          min="0"
          step="1"
          value={quantity}
          onChange={(event) =>
            changeQuantity(event.target.value)
          }
          aria-label={`${product.name} quantity`}
        />

        <button
          type="button"
          className={styles.quantityBtn}
          onClick={() => changeQuantity(quantity + 1)}
          aria-label={`Increase ${product.name} quantity`}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className={styles.addToCartBtn}
        disabled={quantity === 0}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </article>
  )
}

export default ProductCard
