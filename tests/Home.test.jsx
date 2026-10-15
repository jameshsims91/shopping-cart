import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest'
import { CartProvider } from '../src/CartProvider'
import { useCart } from '../src/useCart'
import { useProducts } from '../src/useProducts'
import Home from '../src/products/home/Home'

vi.mock('../src/useProducts', () => ({
  useProducts: vi.fn(),
}))

const mockProducts = [
  {
    id: 1,
    name: 'Backpack',
    price: 29.99,
    image: '/backpack.jpg',
  },
  {
    id: 2,
    name: 'T-Shirt',
    price: 15.5,
    image: '/tshirt.jpg',
  },
  {
    id: 3,
    name: 'Jacket',
    price: 55,
    image: '/jacket.jpg',
  },
  {
    id: 4,
    name: 'Sneakers',
    price: 42,
    image: '/sneakers.jpg',
  },
]

function HomeTestWrapper() {
  const { cartItems, cartCount, cartTotal } = useCart()

  return (
    <>
      <Home />
      <output data-testid="cart-count">{cartCount}</output>
      <output data-testid="cart-total">
        {cartTotal.toFixed(2)}
      </output>
      <output data-testid="cart-items">
        {JSON.stringify(cartItems)}
      </output>
    </>
  )
}

function renderHome() {
  return render(
    <CartProvider>
      <HomeTestWrapper />
    </CartProvider>
  )
}

describe('Home', () => {
  beforeEach(() => {
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders the page heading', () => {
    renderHome()

    expect(
      screen.getByRole('heading', {
        name: 'Checkout the Merch!',
      }),
    ).toBeInTheDocument()
  })

  test('displays three unique API products', () => {
    renderHome()

    const cards = screen.getAllByRole('article')

    expect(cards).toHaveLength(3)

    const names = cards.map(
      (card) => within(card).getByRole('heading').textContent,
    )

    expect(new Set(names).size).toBe(3)

    names.forEach((name) => {
      expect(
        mockProducts.some((product) => product.name === name),
      ).toBe(true)
    })
  })

  test('displays product images and formatted prices', () => {
    renderHome()

    const cards = screen.getAllByRole('article')

    cards.forEach((card) => {
      const name = within(card).getByRole('heading').textContent

      const product = mockProducts.find(
        (item) => item.name === name,
      )

      expect(
        within(card).getByRole('img', { name }),
      ).toHaveAttribute('src', product.image)

      expect(
        within(card).getByText(`$${product.price.toFixed(2)}`),
      ).toBeInTheDocument()
    })
  })

  test('starts each product at quantity zero', () => {
    renderHome()

    const quantities = screen.getAllByRole('spinbutton')

    expect(quantities).toHaveLength(3)

    quantities.forEach((input) => {
      expect(input).toHaveValue(0)
    })

    screen.getAllByRole('button', {
      name: 'Add to Cart',
    }).forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  test('increases quantity, adds to cart, and resets to zero', async () => {
    const user = userEvent.setup()
    renderHome()

    const firstCard = screen.getAllByRole('article')[0]

    const name = within(firstCard)
      .getByRole('heading')
      .textContent
    
    const product = mockProducts.find(
      (item) => item.name === name,
    )

    const input = within(firstCard).getByRole('spinbutton')

    const increaseButton = within(firstCard).getByRole('button', {
      name: `Increase ${name} quantity`
    })

    const addButton = within(firstCard).getByRole('button', {
      name: 'Add to Cart',
    })

    expect(input).toHaveValue(0)
    expect(addButton).toBeDisabled()

    await user.click(increaseButton)
    await user.click(increaseButton)

    expect(input).toHaveValue(2)
    expect(addButton).toBeEnabled()

    await user.click(addButton)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent(
      (product.price * 2).toFixed(2),
    )

    expect(input).toHaveValue(0)
    expect(addButton).toBeDisabled()
  })

  test('displays loading state', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      loading: true,
      error: null,
    })

    renderHome()

    expect(
      screen.getByText('Loading featured products...'),
    ).toBeInTheDocument()
  })

  test('displays error state', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      loading: false,
      error: new Error('Network error'),
    })

    renderHome()

    expect(
      screen.getByRole('alert'),
    ).toHaveTextContent('Unable to load featured products')
  })

  test('displays empty state', () => {
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      loading: false,
      error: null,
    })

    renderHome()

    expect(
      screen.getByText(/no featured products available/i),
    ).toBeInTheDocument()
  })

  test('keeps the same featured products when quantity changes', async () => {
    const user = userEvent.setup()
    renderHome()

    const getProductNames = () =>
      screen.getAllByRole('article').map(
        (card) => 
          within(card).getByRole('heading').textContent
      )
    
    const namesBefore = getProductNames()

    const firstCard = screen.getAllByRole('article')[0]

    const increaseButton = within(firstCard).getByRole('button', {
      name: /increase .* quantity/i,
    })

    await user.click(increaseButton)

    const namesAfter = getProductNames()

    expect(namesAfter).toEqual(namesBefore)
  })
})