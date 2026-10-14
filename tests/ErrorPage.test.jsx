
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, test, expect } from 'vitest'
import ErrorPage from '../src/error/ErrorPage'

describe('ErrorPage', () => {
  test('renders the page-not-found message', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: "YOU'VE LEFT THE SHOP",
      })
    ).toBeInTheDocument()
  })

  test('renders a link back to the home page', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    )

    const homeLink = screen.getByRole('link', {
      name: 'Return Home',
    })

    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
