import config from './config/env.js';

const API_BASE_URL = config.API_BASE_URL;

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // Required for cookies/session handling
    });
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include", // For session handling
    });
  
    return response.json();
};