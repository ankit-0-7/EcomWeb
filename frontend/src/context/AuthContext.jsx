import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Registration Function (Already done)
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            setLoading(false);
            return true; 
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false; 
        }
    };

    // NEW: Login Function
    const login = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData) // Contains email and password
            });

            const data = await response.json();

            // If the backend sends an error (e.g., wrong password), throw it to the UI
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save user data (including the secure JWT token) to browser storage
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            setLoading(false);
            return true; // Success
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false; // Failed
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        // Added 'login' to the exported values so the Login component can use it
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};