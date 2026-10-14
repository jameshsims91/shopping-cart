import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import routes from '../src/routes'

function renderRoute(path) {
  // Reuse the application's route definitions while using
  // an in-memory router instead of a real browser URL.
  const router = createMemoryRouter(routes.routes, {
    initialEntries: [path],
  })

  return render(<RouterProvider router={router} />)
}

describe('Application routes', () => {
  test('renders the Home page at /', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: 'Checkout the Merch!' })
    ).toBeInTheDocument()
  })

  test('renders the Shop page at /shop', () => {
    renderRoute('/shop')

    expect(
      screen.getByRole('heading', { name: 'Welcome to the Shop' })
    ).toBeInTheDocument()
  })

  test('renders the Cart page at /cart', () => {
    renderRoute('/cart')

    expect(
      screen.getByRole('heading', { name: 'Your Cart' })
    ).toBeInTheDocument()
  })

  test('uses the error page for an unknown route', () => {
    renderRoute('/this-page-does-not-exist')

    expect(
      screen.getByRole('heading', {
        name: "YOU'VE LEFT THE SHOP",
      })
    ).toBeInTheDocument()
  })
})
