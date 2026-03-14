async function request(url: string, method: "GET" | "POST", accessToken?: string | null, body?: unknown) {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        credentials: "include",
        mode: "cors",
    })

    if (!response.ok) throw new Error(`Response status ${response.status}`)
    return response.json()
}

export async function getAPI(url = "/api", accessToken?: string | null) {
    const data = await request(url, "GET", accessToken)
    return { message: data, success: true }
}

export async function postAPI(url = "/api", accessToken?: string | null, body: unknown = {}) {
    const data = await request(url, "POST", accessToken, body)
    return { message: data, success: true }
}