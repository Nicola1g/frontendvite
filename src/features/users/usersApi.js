import api from '../../api/axios'

// GET /users
export const listUsers = async () => {
    try {
        const { data } = await api.get('/users')
        return Array.isArray(data) ? data : data?.users || []
    } catch (e) {
        const s = e?.response?.status
        if (s === 400 || s === 404) return []
        throw e
    }
}

// POST /users  { username, password, roles:[], active }
export const createUser = async (payload) => {
    const { data } = await api.post('/users', payload)
    return data
}

// PATCH /users  body: { id, ... }  (fallback su /users/:id)
export const updateUser = async (id, payload) => {
    try {
        const { data } = await api.patch('/users', { id, ...payload })
        return data
    } catch (e) {
        if (e?.response?.status === 404 || e?.response?.status === 405) {
            const { data } = await api.patch(`/users/${id}`, payload)
            return data
        }
        throw e
    }
}

// DELETE /users  body: { id }  (fallback su /users/:id)
export const deleteUserById = async (id) => {
    try {
        const { data } = await api.delete('/users', { data: { id } })
        return data
    } catch (e) {
        if (e?.response?.status === 404 || e?.response?.status === 405) {
            const { data } = await api.delete(`/users/${id}`)
            return data
        }
        throw e
    }
}
