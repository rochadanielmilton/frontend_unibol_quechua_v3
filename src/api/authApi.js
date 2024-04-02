import axios from 'axios'

let BASE_URL = import.meta.env.VITE_BASE_URL;

const authApi = axios.create({
    //variable global para consumo de servicios API-REST
    //baseURL:'http://127.0.0.1:8000',
    //baseURL:'http://192.168.30.9:8000',
    baseURL: BASE_URL,
    params: {
    }
})

export default authApi