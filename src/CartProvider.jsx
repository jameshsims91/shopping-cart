import { useState } from 'react'
import { CartContext } from './CartContext'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (item, quantity = 1) => {
    const amount = Math.max(0, Math.floor(Number(quantity) || 0))
    if(amount === 0) return

    setCartItems((items) => {
      const existing = items.find((product) => product.id === item.id)

      if (existing) {
        return items.map((product) => 
          product.id === item.id 
            ? { ...product, quantity: product.quantity + amount } 
            : product
        )
      }

      return [...items, { ...item, quantity: amount }]
    })
  }

  const updateQuantity = (id, quantity) => {
    const amount = Math.max(0, Math.floor(Number(quantity) || 0))

    setCartItems((items) =>
      amount === 0
        ? items.filter((item) => item.id !== id)
        : items.map((item) =>
            item.id === id ? { ...item, quantity: amount } : item
          )
    )
  }

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const cartTotal = cartItems.reduceRight((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart,cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}