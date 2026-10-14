
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import { CartProvider } from '../src/CartProvider'
import { useCart } from '../src/useCart'
import Cart from '../src/cart/Cart'

const hoodie = {
  id: 2,
  name: 'Weapon X Hoodie',
  price: 40,
  featured: true,
  image: '/test-hoodie.webp',
}

const print = {
  id: 7,
  name: 'Figaro on Stage',
  price: 5,
  featured: true,
  image: '/test-print.webp',
}

function CartTestWrapper() {
  const { addToCart } = useCart()

  return (
    <>
      <Cart />
      <button onClick={() => addToCart(hoodie)}>Add hoodie</button>
      <button onClick={() => addToCart(hoodie, 2)}>Add two hoodies</button>
      <button onClick={() => addToCart(print)}>Add print</button>
    </>
  )
}

function renderCart() {
  return render(
    <CartProvider>
      <CartTestWrapper />
    </CartProvider>
  )
}

function getCartItem(name) {
  const heading = screen.getByRole('heading', { name })
  return heading.parentElement.parentElement
}

describe('Cart', () => {
  test('renders the cart heading and empty message', () => {
    renderCart()

    expect(
      screen.getByRole('heading', { name: 'Your Cart' })
    ).toBeInTheDocument()

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })

  test('displays a product with its price and subtotal', async () => {
    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole('button', { name: 'Add hoodie' }))

    const item = getCartItem('Weapon X Hoodie')

    expect(within(item).getByText('$40.00 each')).toBeInTheDocument()
    expect(within(item).getByText('Subtotal: $40.00')).toBeInTheDocument()
    expect(screen.getByText('Total items:').parentElement).toHaveTextContent('1')
    expect(screen.getByText('Total: $40.00')).toBeInTheDocument()
  })

  test('increases the quantity and recalculates the subtotal and total', async () => {
    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole('button', { name: 'Add hoodie' }))

    const item = getCartItem('Weapon X Hoodie')
    const increase = within(item).getByRole('button', {
      name: 'Increase Weapon X Hoodie quantity',
    })

    await user.click(increase)

    expect(
      within(item).getByRole('spinbutton', {
        name: 'Weapon X Hoodie quantity',
      })
    ).toHaveValue(2)

    expect(within(item).getByText('Subtotal: $80.00')).toBeInTheDocument()
    expect(screen.getByText('Total items:').parentElement).toHaveTextContent('2')
    expect(screen.getByText('Total: $80.00')).toBeInTheDocument()
  })

  test('decreases quantity and disables decrement at one', async () => {
    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole('button', { name: 'Add two hoodies' }))

    const item = getCartItem('Weapon X Hoodie')
    const decrease = within(item).getByRole('button', {
      name: 'Decrease Weapon X Hoodie quantity',
    })

    expect(decrease).toBeEnabled()

    await user.click(decrease)

    expect(
      within(item).getByRole('spinbutton', {
        name: 'Weapon X Hoodie quantity',
      })
    ).toHaveValue(1)

    expect(decrease).toBeDisabled()
    expect(within(item).getByText('Subtotal: $40.00')).toBeInTheDocument()
  })

  test('updates quantity when the input changes', () => {
    renderCart()

    fireEvent.click(screen.getByRole('button', { name: 'Add hoodie' }))

    const item = getCartItem('Weapon X Hoodie')
    const quantity = within(item).getByRole('spinbutton', {
      name: 'Weapon X Hoodie quantity',
    })

    fireEvent.change(quantity, { target: { value: '3' } })

    expect(quantity).toHaveValue(3)
    expect(within(item).getByText('Subtotal: $120.00')).toBeInTheDocument()
    expect(screen.getByText('Total: $120.00')).toBeInTheDocument()
  })

  test('removes an item using the Remove button', async () => {
    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole('button', { name: 'Add hoodie' }))
    await user.click(screen.getByRole('button', { name: 'Add print' }))

    const hoodieItem = getCartItem('Weapon X Hoodie')

    await user.click(
      within(hoodieItem).getByRole('button', { name: 'Remove' })
    )

    expect(
      screen.queryByRole('heading', { name: 'Weapon X Hoodie' })
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Figaro on Stage' })
    ).toBeInTheDocument()

    expect(screen.getByText('Total: $5.00')).toBeInTheDocument()
    expect(screen.getByText('Total items:').parentElement).toHaveTextContent('1')
  })

  test('shows the empty message after the last item is removed', async () => {
    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole('button', { name: 'Add hoodie' }))

    const item = getCartItem('Weapon X Hoodie')

    await user.click(
      within(item).getByRole('button', { name: 'Remove' })
    )

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(screen.queryByText('Total: $40.00')).not.toBeInTheDocument()
  })

  test('displays the combined total for multiple products', async () => {
    const user = userEvent.setup()
    renderCart()

    await user.click(screen.getByRole('button', { name: 'Add hoodie' }))
    await user.click(screen.getByRole('button', { name: 'Add print' }))

    expect(screen.getByText('Total items:').parentElement).toHaveTextContent('2')
    expect(screen.getByText('Total: $45.00')).toBeInTheDocument()
  })
})
