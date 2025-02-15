export interface User {
  _id: string; 
  email: string;
  password: string;
  role: 'admin' | 'customer' | 'serviceProvider';
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  serviceProviderId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Add populated serviceProvider field
  serviceProvider?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Booking {
  _id: string;
  customerId: string;
  serviceId: string;
  serviceProviderId: string;
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
  appointmentDate: Date;
  notes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  
  // Virtual populated fields
  customer?: {
    _id: string;
    name: string;
    email: string;
  };
  service?: {
    _id: string;
    name: string;
    description: string;
    price: number;
  };
  serviceProvider?: {
    _id: string;
    name: string;
    email: string;
  };
}