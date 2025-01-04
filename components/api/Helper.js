// apiService.js
'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your base API URL

// Function to handle GET requests
export const getData = async (endpoint, perameter) => {
    const options = {
        method: 'POST',
        url: `${API_URL}/${endpoint}`,
        headers: {'content-type': 'application/json'},
        data: perameter
      };
      
    try {
        const { data } = await axios.request(options);
        return data; 
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error for further handling
    }
};
