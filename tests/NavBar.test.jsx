import { useCart } from '../src/useCart'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router'
import { CartProvider } from '../src/CartProvider'
import NavBar from '../src/nav-bar/NavBar'

function renderNavBar() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <NavBar />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('NavBar', () => {
  test('renders the Home, Shop, and Cart links', () => {
    renderNavBar()

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cart(0)' })).toBeInTheDocument()
  })

  test('links point to the correct routes', () => {
    renderNavBar()

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute(
      'href',
      '/shop'
    )
    expect(screen.getByRole('link', { name: 'Cart(0)' })).toHaveAttribute(
      'href',
      '/cart'
    )
  })

  test('displays the cart item count', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <NavBar />
        </CartProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Cart(0)' })).toBeInTheDocument()
  })

  test('updates the cart count when a product is added', async () => {
    const user = userEvent.setup()

    function TestNavBar() {
      const { addToCart } = useCart()

      return (
        <>
          <NavBar />
          <button
            onClick={() =>
              addToCart({
                id: 1,
                name: 'Test Shirt',
                price: 20,
              })
            }
          >
            Add test shirt
          </button>
        </>
      )
    }

    render(
      <MemoryRouter>
        <CartProvider>
          <TestNavBar />
        </CartProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Cart(0)' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add test shirt' }))

    expect(screen.getByRole('link', { name: 'Cart(1)' })).toBeInTheDocument()
  })
})
