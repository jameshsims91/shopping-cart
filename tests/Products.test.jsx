
import { describe, test, expect } from 'vitest'
import Products from '../src/products/Products'

describe('Products', () => {
  test('exports an array of 16 products', () => {
    expect(Array.isArray(Products)).toBe(true)
    expect(Products).toHaveLength(16)
  })

  test('every product has the required properties', () => {
    Products.forEach((product) => {
      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('featured')
      expect(product).toHaveProperty('image')
    })
  })

  test('every product has a unique ID', () => {
    const ids = Products.map((product) => product.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every product has a valid name and price', () => {
    Products.forEach((product) => {
      expect(typeof product.name).toBe('string')
      expect(product.name.trim().length).toBeGreaterThan(0)

      expect(typeof product.price).toBe('number')
      expect(Number.isFinite(product.price)).toBe(true)
      expect(product.price).toBeGreaterThanOrEqual(0)
    })
  })

  test('every product has a boolean featured value and an image', () => {
    Products.forEach((product) => {
      expect(typeof product.featured).toBe('boolean')
      expect(product.image).toBeTruthy()
    })
  })

  test('returns the expected featured products', () => {
    const featuredProducts = Products.filter(
      (product) => product.featured
    )

    expect(featuredProducts.map((product) => product.id)).toEqual([
      2, 7, 15,
    ])
  })

  test('contains the expected product names', () => {
    const names = Products.map((product) => product.name)

    expect(names).toContain('Weapon X Hoodie')
    expect(names).toContain('Figaro on Stage')
    expect(names).toContain('Aang ATLAwood Illustration')
  })
})
