import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,  // || '/api',
    withCredentials: true //(import.meta.env.VITE_WITH_CREDENTIALS || 'true') === 'true'
})

export default api
