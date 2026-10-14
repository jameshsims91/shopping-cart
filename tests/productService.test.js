import { afterEach, describe, expect, test, vi } from 'vitest'
import { getProducts } from '../src/api/productService'

const fakeProduct = {
  id: 1,
  title: 'Test Shirt',
  price: 19.99,
  description: 'A test shirt',
  category: "men's clothing",
  image: 'https://example.com/shirt.jpg',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getProducts', () => {
  test('fetches and normalizes products', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [fakeProduct],
    })

    vi.stubGlobal('fetch', fetchMock)

    await expect(getProducts()).resolves.toEqual([
      {
        id: 1,
        name: 'Test Shirt',
        price: 19.99,
        description: 'A test shirt',
        category: "men's clothing",
        image: 'https://example.com/shirt.jpg',
        featured: false,
      },
    ])

    expect(fetchMock).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products',
    )
  })

  test('returns an empty array when the API has no products', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    )

    await expect(getProducts()).resolves.toEqual([])
  })

  test('throws when the server responds with an HTTP error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(getProducts()).rejects.toThrow(
      'Failed to fetch products: 500',
    )
  })

  test('throws when the network request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network unavailable')),
    )

    await expect(getProducts()).rejects.toThrow('Network unavailable')
  })

  test('throws when the response is not an array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ product: fakeProduct }),
      }),
    )

    await expect(getProducts()).rejects.toThrow(
      'Invalid product data: expected an array',
    )
  })
})
