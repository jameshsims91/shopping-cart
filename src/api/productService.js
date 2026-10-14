const PRODUCTS_URL = 'https://fakestoreapi.com/products'

export async function getProducts() {
  const response = await fetch(PRODUCTS_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`)
  }

  const products = await response.json()

  if (!Array.isArray(products)) {
    throw new Error('Invalid product data: expected an array')
  }

  return products.map((product) => ({
    id: product.id,
    name: product.title,
    price: Number(product.price),
    description: product.description,
    category: product.category,
    image: product.image,
    featured: false,
  }))
}