import { api } from './api'
export async function fetchCostumers(){
    const response = await api.get("/costumers")
    return response.data
}