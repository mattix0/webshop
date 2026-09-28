import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchCostumers(){
    const response = await axios.get(`${API_BASE_URL}/costumers`)
    return response.data
}