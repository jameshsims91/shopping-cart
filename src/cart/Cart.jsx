import styles from './Cart.module.css'
import { useCart } from '../useCart'

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
  } = useCart()

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div className={styles.cartItem} key={item.id}>
                <div className={styles.itemDetails}>
                  <h2 className={styles.itemName}>{item.name}</h2>

                  <p className={styles.itemPrice}>
                    ${item.price.toFixed(2)} each
                  </p>

                  <p className={styles.itemSubtotal}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className={styles.quantityControls}>
                  <button
                    type="button"
                    className={styles.quantityBtn}
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>

                  <input
                    className={styles.quantityInput}
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(event) => {
                      const value = event.target.value
                      if (value !== '') {
                        updateQuantity(item.id, value)
                      }
                    }}
                    aria-label={`${item.name} quantity`}
                  />

                  <button
                    type="button"
                    className={styles.quantityBtn}
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <p>
              Total items: <strong>{cartCount}</strong>
            </p>

            <p className={styles.grandTotal}>
              Total: ${cartTotal.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart