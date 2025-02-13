import { useState } from 'react';
import { Booking, Column, TableAction } from '@/types';
import { BaseDataTable } from './BaseDataTable';
import { BookingModal } from '../modals/BookingModals';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export default function BookingTable({bookings, onUpdate, onDelete, onCustomerCancel}: {
  bookings: Booking[]; onUpdate: () => void; onDelete: (bookingId: string) => Promise<void>; onCustomerCancel: (bookingId: string) => Promise<void>;}) {

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const { user } = useAuth();

  const handleAction = (booking: Booking, mode: 'view' | 'edit') => {
    setSelectedBooking(booking);
    setModalMode(mode);
  };

  const columns : Column<Booking>[] = [
    {
      header: 'Service',
      accessorKey: "serviceProviderId",
      cell: (value: any) => value
    },
    {
      header: 'Date & Time',
      accessorKey: 'appointmentDate',
      cell: (value: any) => formatDate(value)
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'confirmed' ? 'bg-blue-100 text-blue-800' :
          value === 'inProgress'? 'bg-orange-100 text-orange-800':
          value === 'cancelled' ? 'bg-red-100 text-red-800' :
          value === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ];

  const getActions = () : TableAction<Booking>[] => {
  
    const baseActions: TableAction<Booking>[] = [
      {
        label: 'View Details',
        onClick: (booking: Booking) => handleAction(booking, 'view'),
      }
    ];

    // Add delete action for customers with pending bookings
    if (user?.role === 'customer') {
      baseActions.push({
        label: 'Cancel Booking',
        onClick: (booking: Booking) => onCustomerCancel(booking._id),
        showCondition: (booking: Booking) => booking.status.toString() === 'pending'
      });
    }

    // Add edit action for admin and service provider
    if (user?.role === 'admin' || user?.role === 'serviceProvider') {
      baseActions.push({
        label: 'Edit Status',
        onClick: (booking: Booking) => handleAction(booking, 'edit'),
      });
    }

    // Add edit action for admin and service provider
    if (user?.role === 'admin') {
      baseActions.push({
        label: 'Delete Booking',
        onClick: (booking: Booking) => onDelete(booking._id),
      });
    }

    return baseActions;
  };

  return (
    <>
      <BaseDataTable
        data={bookings} // The fetched booking values
        columns={columns} // The colums as defined above.
        actions={getActions()} // Actions for each booking shown conditionally
        basePath="/bookings"
      />
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking} 
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={onUpdate} // Execute onUpdate function upon successful execution
          mode={modalMode}
        />
      )}
    </>
  );
}
