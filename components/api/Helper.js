// apiService.js
'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL; // Replace with your base API URL

// Function to handle GET requests
export const getData = async (endpoint, parameter) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  const options = {
      method: 'POST',
      url: `${API_URL}/${endpoint}`,
      headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }) // Add token to header if it exists
      },
      data: parameter
  };

  try {
      const { data } = await axios.request(options);
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error for further handling
  }
};


export const insertData = async (endpoint, data, flag) => {
    try {
      let header;
      if(flag){
        const token = localStorage.getItem('token');
        header = { headers: { "Content-Type": "application/json", "Authorization":  `Bearer ${token}` }};
      } else{
        header = { headers: { "Content-Type": "application/json" }};
      }
      const response = await axios.post(`${API_URL}/${endpoint}`, data, header);
      return response.data;
    } catch (error) {
      if(error.status === 401){
        localStorage.clear();
        window.location.href = '/'; 
      }
      console.error('Error inserting data:', error);
      throw error; // Re-throw the error for further handling
    }
  };