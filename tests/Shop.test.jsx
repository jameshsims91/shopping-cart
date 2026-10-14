
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import { CartProvider } from '../src/CartProvider'
import { useCart } from '../src/useCart'
import Shop from '../src/products/shop/Shop'
import Products from '../src/products/Products'

function ShopTestWrapper() {
  const { cartItems, cartCount, cartTotal } = useCart()

  return (
    <>
      <Shop />
      <output data-testid="cart-count">{cartCount}</output>
      <output data-testid="cart-total">{cartTotal.toFixed(2)}</output>
      <output data-testid="cart-items">{JSON.stringify(cartItems)}</output>
    </>
  )
}

function renderShop() {
  return render(
    <CartProvider>
      <ShopTestWrapper />
    </CartProvider>
  )
}

function getProductCard(productName) {
  const heading = screen.getByRole('heading', { name: productName })
  return heading.parentElement
}

describe('Shop', () => {
  test('renders the shop heading and description', () => {
    renderShop()

    expect(
      screen.getByRole('heading', { name: 'Welcome to the Shop' })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Browse our awesome products here!')
    ).toBeInTheDocument()
  })

  test('renders every product in the catalog', () => {
    renderShop()

    expect(Products).toHaveLength(16)

    const headings = screen.getAllByRole('heading', { level: 2 })

    expect(headings).toHaveLength(Products.length)

    const renderedNames = headings.map((heading) => heading.textContent.trim())

    Products.forEach((product) => {
      expect(
        renderedNames,
        `Expected "${product.name.trim()}" to appear in the shop`
      ).toContain(product.name.trim())
    })
  })

  test('starts each product at quantity zero with decrement and add disabled', () => {
    renderShop()

    const card = getProductCard('Weapon X Hoodie')

    expect(
      within(card).getByRole('spinbutton', {
        name: 'Weapon X Hoodie quantity',
      })
    ).toHaveValue(0)

    expect(
      within(card).getByRole('button', {
        name: 'Decrease Weapon X Hoodie quantity',
      })
    ).toBeDisabled()

    expect(
      within(card).getByRole('button', { name: 'Add to Cart' })
    ).toBeDisabled()
  })

  test('increases and decreases the quantity', async () => {
    const user = userEvent.setup()
    renderShop()

    const card = getProductCard('Weapon X Hoodie')
    const quantity = within(card).getByRole('spinbutton', {
      name: 'Weapon X Hoodie quantity',
    })
    const increase = within(card).getByRole('button', {
      name: 'Increase Weapon X Hoodie quantity',
    })
    const decrease = within(card).getByRole('button', {
      name: 'Decrease Weapon X Hoodie quantity',
    })

    await user.click(increase)
    expect(quantity).toHaveValue(1)
    expect(decrease).toBeEnabled()

    await user.click(increase)
    expect(quantity).toHaveValue(2)

    await user.click(decrease)
    expect(quantity).toHaveValue(1)
  })

  test('does not allow the quantity to go below zero', async () => {
    renderShop()

    const card = getProductCard('Weapon X Hoodie')
    const quantity = within(card).getByRole('spinbutton', {
      name: 'Weapon X Hoodie quantity',
    })
    const decrease = within(card).getByRole('button', {
      name: 'Decrease Weapon X Hoodie quantity',
    })

    expect(decrease).toBeDisabled()
    expect(quantity).toHaveValue(0)

    // Even a direct input change to a negative number is clamped to zero.
    fireEvent.change(quantity, { target: { value: '-3' } })

    expect(quantity).toHaveValue(0)
    expect(decrease).toBeDisabled()
  })

  test('adds the selected quantity to the cart and resets it to zero', async () => {
    const user = userEvent.setup()
    renderShop()

    const card = getProductCard('Weapon X Hoodie')
    const quantity = within(card).getByRole('spinbutton', {
      name: 'Weapon X Hoodie quantity',
    })
    const increase = within(card).getByRole('button', {
      name: 'Increase Weapon X Hoodie quantity',
    })
    const addButton = within(card).getByRole('button', {
      name: 'Add to Cart',
    })

    await user.click(increase)
    await user.click(increase)

    expect(quantity).toHaveValue(2)
    expect(addButton).toBeEnabled()

    await user.click(addButton)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('80.00')
    expect(screen.getByTestId('cart-items')).toHaveTextContent('"quantity":2')
    expect(quantity).toHaveValue(0)
    expect(addButton).toBeDisabled()
  })

  test('floors decimal quantities to whole numbers', () => {
    renderShop()

    const card = getProductCard('Weapon X Hoodie')
    const quantity = within(card).getByRole('spinbutton', {
      name: 'Weapon X Hoodie quantity',
    })

    fireEvent.change(quantity, { target: { value: '2.8' } })

    expect(quantity).toHaveValue(2)
  })
})
