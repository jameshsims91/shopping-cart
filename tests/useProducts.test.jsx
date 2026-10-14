import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { getProducts } from '../src/api/productService'
import { useProducts } from '../src/useProducts'

vi.mock('../src/api/productService', () => ({
  getProducts: vi.fn(),
}))

afterEach(() => {
  vi.resetAllMocks()
})

const fakeProducts = [
  {
    id: 1,
    name: 'Test Shirt',
    price: 19.99,
    image: 'https://example.com/shirt.jpg',
    featured: false,
  },
  {
    id: 2,
    name: 'Test Hoodie',
    price: 39.99,
    image: 'https://example.com/hoodie.jpg',
    featured: true,
  },
]

describe('useProducts', () => {
  test('starts in the loading state', () => {
    getProducts.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useProducts())

    expect(result.current.products).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  test('loads and returns products successfully', async () => {
    getProducts.mockResolvedValue(fakeProducts)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(fakeProducts)
    expect(result.current.error).toBeNull()
  })

  test('handles an empty product list', async () => {
    getProducts.mockResolvedValue([])

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBeNull()
  })

  test('handles a failed request', async () => {
    getProducts.mockRejectedValue(new Error('Network unavailable'))

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('Network unavailable')
  })

  test('calls getProducts when the hook mounts', async () => {
    getProducts.mockResolvedValue(fakeProducts)

    renderHook(() => useProducts())

    await waitFor(() => {
      expect(getProducts).toHaveBeenCalledTimes(1)
    })
  })
})
