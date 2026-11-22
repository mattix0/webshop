export function errorMessage(error, fallback) {
    const detail = error.response?.data?.detail

    if (typeof detail === 'string') {
        return detail
    }

    // FastAPI returns an array of validation error objects on 422
    if (Array.isArray(detail)) {
        const text = detail
            .map((item) => {
                const field = Array.isArray(item.loc) ? item.loc.at(-1) : null
                return field ? `${field}: ${item.msg}` : item.msg
            })
            .filter(Boolean)
            .join('. ')
        return text || fallback
    }

    return fallback
}