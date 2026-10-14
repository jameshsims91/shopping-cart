import { useState } from 'react'
import styles from './Shop.module.css'
import Products from '../Products'
import { useCart } from '../../useCart'

const Shop = () => {
  const [quantities, setQuantities] = useState({})
  const { addToCart } = useCart()

  const changeQuantity = (id, value) => {
    const amount = Math.max(0, Math.floor(Number(value) || 0))

    setQuantities((previous) => ({
      ...previous,
      [id]: amount,
    }))
  }

  return (
    <div className={styles.shopContainer}>
      <h1 className={styles.title}>Welcome to the Shop</h1>
      <p className={styles.text}>Browse our awesome products here!</p>

      <div className={styles.merchGrid}>
        {Products.map((item) => (
          <div className={styles.merchCard} key={item.id}>
            <img
              className={styles.productImage}
              src={item.image}
              alt={item.name}
            />
            
            <h2 className={styles.itemName}>{item.name}</h2>
            <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>

            <div className={styles.quantityControls}>
              <button
                type="button"
                className={styles.quantityBtn}
                disabled={!quantities[item.id]}
                onClick={() =>
                  changeQuantity(item.id, (quantities[item.id] || 0) - 1)
                }
                aria-label={`Decrease ${item.name} quantity`}
              >
                −
              </button>

              <input
                className={styles.quantityInput}
                type="number"
                min="0"
                step="1"
                value={quantities[item.id] || 0}
                onChange={(event) =>
                  changeQuantity(item.id, event.target.value)
                }
                aria-label={`${item.name} quantity`}
              />

              <button
                type="button"
                className={styles.quantityBtn}
                onClick={() =>
                  changeQuantity(item.id, (quantities[item.id] || 0) + 1)
                }
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={styles.addToCartBtn}
              disabled={!quantities[item.id]}
              onClick={() => {
                addToCart(item, quantities[item.id])
                changeQuantity(item.id, 0)
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Shop