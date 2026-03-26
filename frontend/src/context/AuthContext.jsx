import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    // FIX 1: We check localStorage immediately during initialization.
    // This prevents the split-second "null" state that was kicking you out of the cart!
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // FIX 2: Updated to accept individual arguments matching your new Register.jsx
    const register = async (name, email, password, role) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return true; 
        } catch (err) {
            setError(err.message);
            throw err; // Throws error back to the UI so the user can see it
        } finally {
            setLoading(false);
        }
    };

    // FIX 3: Updated to accept email and password matching your new Login.jsx
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save user data (including the secure JWT token) to browser storage
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return true; 
        } catch (err) {
            setError(err.message);
            throw err; // Throws error back to the UI
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};