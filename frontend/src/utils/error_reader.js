export function ReadError(error)
{
    if (!error?.response?.data)
    {
        return "Network error"
    }

    const data = error.response.data

    if (data.status !== "error") return null

    const message = data.error?.message

    if (!message) return "Unknown error"

    if (typeof message === "string")
    {
        return message
    }

    if (typeof message === "object")
    {
        return Object.entries(message)
            .map(([field, errors]) => {
                const text = Array.isArray(errors) ? errors.join(", ") : errors
                return `${field}: ${text}`
            })
            .join("\n")
    }

    return "Unknown error"
}