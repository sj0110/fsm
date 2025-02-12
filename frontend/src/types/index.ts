export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'serviceProvider' | 'admin';
    token: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface Booking {
    id: string;
    serviceName: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    userId: string;
    serviceId: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}