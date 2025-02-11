export interface User {
  uuid: string; // Use UUID instead of _id
  email: string;
  password: string;
  role: 'admin' | 'customer' | 'serviceProvider';
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  uuid: string; // Use UUID instead of _id
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  serviceProviderId: string; // Now references a UUID
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  uuid: string; // Use UUID instead of _id
  customerId: string; // Now references a UUID
  serviceId: string; // Now references a UUID
  serviceProviderId: string; // Now references a UUID
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
  appointmentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

