
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import { CartProvider } from '../src/CartProvider'
import { useCart } from '../src/useCart'
import Home from '../src/products/home/Home'

function HomeTestWrapper() {
  const { cartItems, cartCount, cartTotal } = useCart()

  return (
    <>
      <Home />
      <output data-testid="cart-count">{cartCount}</output>
      <output data-testid="cart-total">{cartTotal.toFixed(2)}</output>
      <output data-testid="cart-items">{JSON.stringify(cartItems)}</output>
    </>
  )
}

function renderHome() {
  return render(
    <CartProvider>
      <HomeTestWrapper />
    </CartProvider>
  )
}

describe('Home', () => {
  test('renders the page heading', () => {
    renderHome()

    expect(
      screen.getByRole('heading', { name: 'Checkout the Merch!' })
    ).toBeInTheDocument()
  })

  test('renders the three featured products', () => {
    renderHome()

    expect(
      screen.getByRole('heading', { name: 'Weapon X Hoodie' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Figaro on Stage' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Monki Matt Tag(Yellow)' })
    ).toBeInTheDocument()

    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  test('renders product images with accessible alt text', () => {
    renderHome()

    expect(
      screen.getByRole('img', { name: 'Weapon X Hoodie' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('img', { name: 'Figaro on Stage' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('img', { name: 'Monki Matt Tag(Yellow)' })
    ).toBeInTheDocument()
  })

  test('displays prices with two decimal places', () => {
    renderHome()

    const hoodie = screen
      .getByRole('heading', { name: 'Weapon X Hoodie' })
      .closest('article')

    expect(within(hoodie).getByText('$40.00')).toBeInTheDocument()
  })

  test('adds the selected quantity to the cart and resets the input', async () => {
    const user = userEvent.setup()
    renderHome()

    const quantities = screen.getAllByRole('spinbutton')
    const addButtons = screen.getAllByRole('button', {
      name: 'Add to Cart',
    })

    fireEvent.change(quantities[0], { target: { value: 2} })
    
    await user.click(addButtons[0])

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('80.00')
    expect(screen.getByTestId('cart-items')).toHaveTextContent('"quantity":2')

    expect(quantities[0]).toHaveValue(1)
  })

  test('defaults the quantity to one', () => {
    renderHome()

    const quantities = screen.getAllByRole('spinbutton')

    expect(quantities).toHaveLength(3)

    quantities.forEach((input) => {
      expect(input).toHaveValue(1)
    })
  })
})
