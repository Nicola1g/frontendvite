import api from '../../api/axios'

// GET /notes
export const listNotes = async () => {
    try {
        const { data } = await api.get('/notes')
        return Array.isArray(data) ? data : data?.notes || []
    } catch (e) {
        const s = e?.response?.status
        if (s === 400 || s === 404) return [] // backend che risponde "No notes found"
        throw e
    }
}

// POST /notes  { title, text, user, completed? }
export const createNote = async (payload) => {
    const body = { completed: false, ...payload }
    const { data } = await api.post('/notes', body)
    return data
}

// PATCH /notes  body: { id, title, text, user, completed }
export const updateNote = async (id, payload) => {
    try {
        const body = { id, ...payload }
        const { data } = await api.patch('/notes', body)
        return data
    } catch (e) {
        // fallback per backend /notes/:id
        if (e?.response?.status === 404 || e?.response?.status === 405) {
            const { data } = await api.patch(`/notes/${id}`, payload)
            return data
        }
        throw e
    }
}

// DELETE /notes  body: { id }
export const deleteNoteById = async (id) => {
    const { data } = await api.delete('/notes', { data: { id } })
    return data
}
