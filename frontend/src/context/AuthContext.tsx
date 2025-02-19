import React, { createContext, useState, useContext, ReactNode, useLayoutEffect } from 'react';
import { User, AuthContextType } from '../types';
import { endpoints } from '../config/api';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null); // setting the token as string or null

    useLayoutEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<User>(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
            } catch (error) {
                toast.error('Authentication Error: Token is invalid');
                localStorage.removeItem('authToken');
            }
        }
    }, []);
    
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(endpoints.auth.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const {token} = await response.json(); // Get Token in JSON response object
            if (response.ok) {
                const decoded: User = jwtDecode<User>(token);
                setUser(decoded);
                setToken(token); // Store token separately
                localStorage.setItem('authToken', token); // Persist token if needed
                toast.success('Login Successful');
                navigate('/services'); // Redirect to dashboard after successful login
                return { success: true };
            }
            toast.error('Login failed, Please try again.');
            return { success: false, error: 'Login failed, Please try again.' };
        } catch (error) {
            toast.error('Login failed. Please try again')
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                const response = await fetch(endpoints.auth.logout, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    toast.success('Logout successful');
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('authToken');
                }
                else {
                    toast.error('Failed to logout');
                }
            }
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Piece of code defines a custom React Hook called useAuth, which provides access to the authentication context.
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext); // retrieves the current value of AuthContext, (user, login, and logout).
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context; // returns the context value, allowing the component to access authentication data (user, login, and logout functions).
};
