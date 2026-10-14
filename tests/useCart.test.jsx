
import { renderHook } from '@testing-library/react'
import { CartProvider } from '../src/CartProvider'
import { useCart } from '../src/useCart'
import { describe, test, expect } from 'vitest'

describe('useCart', () => {
  test('returns the cart context inside CartProvider', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    expect(result.current).toHaveProperty('cartItems')
    expect(result.current).toHaveProperty('addToCart')
    expect(result.current).toHaveProperty('updateQuantity')
    expect(result.current).toHaveProperty('removeFromCart')
    expect(result.current).toHaveProperty('cartCount', 0)
    expect(result.current).toHaveProperty('cartTotal', 0)
  })

  test('throws an error when used outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used inside CartProvider'
    )
  })
})
