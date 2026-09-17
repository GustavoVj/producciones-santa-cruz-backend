import axios from 'axios';

export const api = axios.create({
    // Le agregamos /produccion al final de la URL
    baseURL: 'http://localhost:3001/api/produccion', 
    headers: {
        'Content-Type': 'application/json'
    }
});