import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                axios.defaults.headers.common['x-auth-token'] = token;
                const response = await axios.get('/api/users/me');
                setUser(response.data);
                setUserRole(response.data.role);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Nie udało się załadować użytkownika:', error);
                setIsAuthenticated(false);
                setUserRole(null);
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        loadUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
