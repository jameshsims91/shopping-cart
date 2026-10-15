import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Shop from '../src/products/shop/Shop'
import { useProducts } from '../src/useProducts'

vi.mock('../src/useProducts', () => ({
  useProducts: vi.fn(() => ({
    products: [],
    loading: true,
    error: null,
  }))
}))

vi.mock('../src/useCart', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  })
}))

const mockProducts = [
  {
    id: 1,
    name: 'Classic Backpack',
    price: 29.99,
    image: 'https://example.com/backpack.jpg',
    description: 'A durable everyday backpack',
    category: 'accessories',
    featured: false,
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 15.5,
    image: 'https://example.com/tshirt.jpg',
    description: 'A comfortable cotton t-shirt',
    category: 'clothing',
    featured: false,
  },
]

describe('Shop product loading UI', () => {
  beforeEach(() => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      loading: true,
      error: null,
    })
  })
  test('displays a loading message while fetching products', () => {
    render(<Shop />)

    expect(screen.getByText(/loading products/i)).toBeInTheDocument()
  })
  test('displays an error message when products fail to load', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      loading: false,
      error: new Error('Failed to fetch products'),
    })

    render(<Shop />)

    expect(
      screen.getByText(/unable to load products/i),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(/loading products/i),
    ).not.toBeInTheDocument()
  })
  test('displays a message when no products are available', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    })
    
    render(<Shop />)

    expect(
      screen.getByText(/no products available/i),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(/loading products/i),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(/unable to load products/i),
    ).not.toBeInTheDocument()
  })
  test('displays products when loading succeeds', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    })

    render(<Shop />)

    // Check product names
    expect(
      screen.getByRole('heading', { name: 'Classic Backpack' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Cotton T-Shirt' }),
    ).toBeInTheDocument()

    // Check formatted prices
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('$15.50')).toBeInTheDocument()

    // Check product images
    expect(
      screen.getByRole('img', { name: 'Classic Backpack' }),
    ).toHaveAttribute(
      'src',
      'https://example.com/backpack.jpg',
    )

    expect(
      screen.getByRole('img', { name: 'Cotton T-Shirt' }),
    ).toHaveAttribute(
      'src',
      'https://example.com/tshirt.jpg',
    )

    // Check quantity
    expect(
      screen.getByRole('spinbutton', {
        name: 'Classic Backpack quantity',
      }),
    ).toHaveValue(0)

    expect(
      screen.getByRole('spinbutton', {
        name: 'Cotton T-Shirt quantity',
      }),
    ).toHaveValue(0)

    // Check Add to Cart buttons
    expect(
      screen.getAllByRole('button', { name: 'Add to Cart' }),
    ).toHaveLength(2)

    //Loading and error messages should be gone
    expect(
      screen.queryByText(/loading products/i),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(/unable to load products/i),
    ).not.toBeInTheDocument()
  })
})
