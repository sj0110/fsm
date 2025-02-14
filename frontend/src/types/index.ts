export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'serviceProvider' | 'admin';
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


export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

export interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  showCondition?: (item: T) => boolean;
}

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: any) => React.ReactNode;
}

export interface BaseDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions: {
    label: string;
    onClick: (item: T) => void;
    showCondition?: (item: T) => boolean;
  }[];
  // basePath: string;
  // onRowClick?: (item: T) => void;
}

export interface BookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'view' | 'edit';
}

export interface ServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'view' | 'edit' | 'book';
  serviceProviders?: User[];
}

export type BookingStatus = "pending" | "confirmed" | "inProgress" | "completed" | "cancelled";
