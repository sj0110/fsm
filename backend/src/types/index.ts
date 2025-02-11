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
  duration: number; // in minutes
  price: number;
  serviceProviderId: string; // Now references an ObjectId
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  _id: string; 
  customerId: string; // Now references an ObjectId
  serviceId: string; // Now references an ObjectId
  serviceProviderId: string; // Now references an ObjectId
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
  appointmentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
