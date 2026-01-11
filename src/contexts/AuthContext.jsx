import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockApi } from '../lib/mockApi';

const AuthContext = createContext(null);

// Named export for the Provider
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('bank_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await mockApi.login(email, password);
            setUser(userData);
            localStorage.setItem('bank_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("AuthContext Login Error:", error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bank_user');
    };

    const updateRole = (newRole) => {
        if (user) {
            const updatedUser = { ...user, role: newRole };
            setUser(updatedUser);
            localStorage.setItem('bank_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateRole, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Named export for the hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
