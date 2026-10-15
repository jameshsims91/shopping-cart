import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import ProductCard from '../src/products/ProductCard'
import { useCart } from '../src/useCart'

vi.mock('../src/useCart', () => ({
  useCart: vi.fn(),
}))

const mockAddToCart = vi.fn()

const mockProduct = {
  id: 1,
  name: 'Classic Backpack',
  price: 29.99,
  image: 'https://example.com/backpack.jpg',
  description: 'An everyday backpack',
  category: 'accessories',
  featured: false,
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCart).mockReturnValue({
      addToCart: mockAddToCart,
    })
  })

  test('renders the product information', () => {
    render(<ProductCard product={mockProduct} />)

    expect(
      screen.getByRole('heading', {
        name: 'Classic Backpack',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('$29.99')).toBeInTheDocument()

    expect(
      screen.getByRole('img', {
        name: 'Classic Backpack',
      }),
    ).toHaveAttribute(
      'src',
      'https://example.com/backpack.jpg',
    )
  })

  test('starts at quantity zero with buttons disabled', () => {
    render(<ProductCard product={mockProduct} />)

    expect(
      screen.getByRole('spinbutton', {
        name: 'Classic Backpack quantity',
      }),
    ).toHaveValue(0)

    expect(
      screen.getByRole('button', {
        name: 'Decrease Classic Backpack quantity',
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: 'Add to Cart',
      }),
    ).toBeDisabled()
  })

  test('increases and decreases quantity', async () => {
    const user = userEvent.setup()

    render(<ProductCard product={mockProduct} />)

    const quantity = screen.getByRole('spinbutton')

    const increase = screen.getByRole('button', {
      name: 'Increase Classic Backpack quantity',
    })

    const decrease = screen.getByRole('button', {
      name: 'Decrease Classic Backpack quantity',
    })

    await user.click(increase)
    await user.click(increase)

    expect(quantity).toHaveValue(2)

    await user.click(decrease)

    expect(quantity).toHaveValue(1)

    await user.click(decrease)

    expect(quantity).toHaveValue(0)
    expect(decrease).toBeDisabled()
  })

  test('adds selected quantity to cart and resets to zero', async () => {
    const user = userEvent.setup()

    render(<ProductCard product={mockProduct} />)

    const increase = screen.getByRole('button', {
      name: 'Increase Classic Backpack quantity',
    })

    const addButton = screen.getByRole('button', {
      name: 'Add to Cart',
    })

    await user.click(increase)
    await user.click(increase)

    await user.click(addButton)

    expect(mockAddToCart).toHaveBeenCalledWith(
      mockProduct,
      2,
    )

    expect(
      screen.getByRole('spinbutton'),
    ).toHaveValue(0)

    expect(addButton).toBeDisabled()
  })
})