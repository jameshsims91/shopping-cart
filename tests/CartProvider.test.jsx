
import { useContext } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartContext } from '../src/CartContext'
import { CartProvider } from '../src/CartProvider'
import { test, describe, expect } from 'vitest'

function CartTestComponent() {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
  } = useContext(CartContext)

  const shirt = {
    id: 1,
    name: 'Test Shirt',
    price: 20,
  }

  return (
    <div>
      <button onClick={() => addToCart(shirt)}>Add shirt</button>
      <button onClick={() => addToCart(shirt, 2)}>
        Add two shirts
      </button>
      <button onClick={() => updateQuantity(1, 3)}>
        Set quantity to three
      </button>
      <button onClick={() => updateQuantity(1, 0)}>
        Set quantity to zero
      </button>
      <button onClick={() => removeFromCart(1)}>
        Remove shirt
      </button>

      <output data-testid="cart-items">
        {JSON.stringify(cartItems)}
      </output>
      <output data-testid="cart-count">{cartCount}</output>
      <output data-testid="cart-total">{cartTotal.toFixed(2)}</output>
    </div>
  )
}

function renderCart() {
  return render(
    <CartProvider>
      <CartTestComponent />
    </CartProvider>
  )
}

describe('CartProvider', () => {
  test('starts with an empty cart', () => {
    renderCart()

    expect(screen.getByTestId('cart-items')).toHaveTextContent('[]')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0.00')
  })

  test('adds a product to the cart', () => {
    renderCart()

    fireEvent.click(screen.getByRole('button', { name: 'Add shirt' }))

    expect(screen.getByTestId('cart-items')).toHaveTextContent(
      '"name":"Test Shirt"'
    )
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('20.00')
  })

  test('combines repeated additions of the same product', () => {
    renderCart()

    fireEvent.click(screen.getByRole('button', { name: 'Add shirt' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add two shirts' }))

    expect(screen.getByTestId('cart-items')).toHaveTextContent('"quantity":3')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('60.00')
  })

  test('updates a product quantity and recalculates the total', () => {
    renderCart()

    fireEvent.click(screen.getByRole('button', { name: 'Add shirt' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Set quantity to three' })
    )

    expect(screen.getByTestId('cart-items')).toHaveTextContent('"quantity":3')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('60.00')
  })

  test('removes a product when its quantity becomes zero', () => {
    renderCart()

    fireEvent.click(screen.getByRole('button', { name: 'Add shirt' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Set quantity to zero' })
    )

    expect(screen.getByTestId('cart-items')).toHaveTextContent('[]')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0.00')
  })

  test('removes a product using removeFromCart', () => {
    renderCart()

    fireEvent.click(screen.getByRole('button', { name: 'Add shirt' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove shirt' }))

    expect(screen.getByTestId('cart-items')).toHaveTextContent('[]')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0.00')
  })
})

