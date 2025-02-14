import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { endpoints } from '@/config/api';
import BookingTable from '@/component/tables/BookingTable';
import { toast } from 'react-toastify';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  
  const handleDelete = async (bookingId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication Error: Please log in first');
            setLoading(false);
            return;
    }

    try{
      const response = await fetch(endpoints.bookings.delete(bookingId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        toast.success('Bookings deleted successfully');
        fetchBookings(); // refresh bookings after successful deletion
      } else {
        throw new Error('Failed to delete booking');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerCancel = async (bookingId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Please login to view booking');
      setLoading(false);
      return;
    }

    try{
      const response = await fetch(endpoints.bookings.update(bookingId), { // cancelling a customer's booking
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Booking deleted successfully');
        fetchBookings(); // refresh bookings after successful cancellation
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication Error: Please log in first');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoints.bookings.getAll, { // fetching all service bookings
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return bookings.length > 0 ? (
    <BookingTable
      bookings={bookings}
      onUpdate={fetchBookings}
      onDelete={handleDelete}
      onCustomerCancel={handleCustomerCancel}
    />
  ) : (
    <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
      No bookings available
    </div>
  );  
};

export default Bookings;