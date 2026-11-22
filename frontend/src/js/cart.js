import { fetchProducts } from './products'
import { api } from './api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CART_KEY = "cart"

export function getCart() {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function storeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(product, qty = 1) {
    const cart = getCart()
    const existing = cart.find((item) => item.product_id === product.product_id)

    if (existing) {
        existing.qty += qty
    } else {
        cart.push({
            product_id: product.product_id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            qty,
        })
    }

    storeCart(cart)
    return cart
}

export function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.product_id !== productId)
    storeCart(cart)
    return cart
}

export function setQty(productId, qty) {
    if (qty <= 0) return removeFromCart(productId)
    const cart = getCart().map((item) =>
        item.product_id === productId ? { ...item, qty } : item
    )
    storeCart(cart)
    return cart
}

export function clearCart() {
    localStorage.removeItem(CART_KEY)
}


async function fetchByIds(ids) {
    const all = await fetchProducts()
    return all.filter((p) => ids.includes(p.product_id))
}

export async function loadCart() {
    const stored = getCart()
    if (stored.length === 0) {
        return { lines: [], notices: [] }
    }

    const products = await fetchByIds(stored.map((i) => i.product_id))
    const notices = []
    const lines = []

    for (const item of stored) {
        const product = products.find((p) => p.product_id === item.product_id)

        if (!product) {
            notices.push('An item is no longer available and was removed.')
            continue
        }
        if (product.stock <= 0) {
            notices.push(`${product.name} is sold out and was removed.`)
            continue
        }

        const qty = Math.min(item.qty, product.stock)
        if (qty < item.qty) {
            notices.push(`Only ${qty} left of ${product.name}. Quantity adjusted.`)
        }

        lines.push({ ...product, qty })
    }

    storeCart(lines.map(({ product_id, qty }) => ({ product_id, qty })))
    return { lines, notices }
}

export async function checkoutCart() {
    const cart = getCart()
    if (cart.length === 0) {
        throw new Error('Cart is empty.')
    }

    const payload = {
        items: cart.map(({ product_id, qty }) => ({
            product_id,
            quantity: qty,
        })),
    }

    const response = await api.post("/checkout", payload)
    clearCart()
    return response.data
}