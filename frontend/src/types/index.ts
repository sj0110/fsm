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
  createdAt: Date;
  updatedAt: Date;
  // Add populated fields
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

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export type BookingStatus = "pending" | "confirmed" | "inProgress" | "completed" | "cancelled";

export type SortDirection = 'asc' | 'desc';

