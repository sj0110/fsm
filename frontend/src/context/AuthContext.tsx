import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { endpoints } from '../config/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(endpoints.auth.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                const decoded: User = jwtDecode<User>(data.token);
                setUser(decoded);
                setToken(data.token); // Store token separately
                localStorage.setItem('authToken', data.token); // Persist token if needed
                return { success: true };
            }
            return { success: false, error: data.message };
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await fetch(endpoints.auth.logout, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken'); // Clear token storage
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
