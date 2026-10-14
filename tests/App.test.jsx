
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import App from '../src/App'
import { useCart } from '../src/useCart'

function TestPage() {
  return <h1>Test page content</h1>
}

function CartContextTestPage() {
  const { cartCount, addToCart } = useCart()

  return (
    <>
      <p>Cart count: {cartCount}</p>
      <button
        onClick={() =>
          addToCart({
            id: 999,
            name: 'Test Shirt',
            price: 20,
          })
        }
      >
        Add test product
      </button>
    </>
  )
}

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<TestPage />} />
          <Route
            path="cart-test"
            element={<CartContextTestPage />}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('App', () => {
  test('renders the navigation bar', () => {
    renderApp()

    expect(
      screen.getByRole('navigation')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: 'Home' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: 'Shop' })
    ).toBeInTheDocument()
  })

  test('renders routed content inside the main element', () => {
    renderApp()

    const main = screen.getByRole('main')

    expect(main).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Test page content' })
    ).toBeInTheDocument()
    expect(main).toContainElement(
      screen.getByRole('heading', { name: 'Test page content' })
    )
  })

  test('provides cart context to routed page components', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')

    renderApp('/cart-test')

    expect(screen.getByText('Cart count: 0')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Add test product' })
    )

    expect(screen.getByText('Cart count: 1')).toBeInTheDocument()
  })
})
