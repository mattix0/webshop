const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function imageUrl(path) {
    if (!path) {
        return null
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }
    return `${API_BASE_URL}${path}`
}