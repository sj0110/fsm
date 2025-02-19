import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(email, password);
        if (!result.success) {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="p-6 md:p-8 md:mb-48 bg-white rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            autoComplete='on'
                        />
                    </div>

                    <div className="relative">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            required
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-13 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <button
                        type="submit"
                        className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;