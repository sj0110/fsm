import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { endpoints } from '@/config/api';
import BookingTable from '@/component/tables/BookingTable';
import { useToast } from "@/hooks/use-toast"

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  
  const handleDelete = async (bookingId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to delete bookings",
      });
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
        toast({
          variant: "default",
          title: "Booking deleted",
          description: "Booking deleted successfully",
        });
        fetchBookings(); // refresh bookings after successful deletion
      } else {
        throw new Error('Failed to delete booking');
      }
    } catch (error) {
      const err = error as Error; 
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerCancel = async (bookingId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to view bookings",
      });
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
        toast({
          variant: "default",
          title: "Booking cancelled",
          description: "Booking cancelled successfully",
        });
        fetchBookings(); // refresh bookings after successful cancellation
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      const err = error as Error; 
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to view bookings",
      });
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
      const err = error as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
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

  return <BookingTable bookings={bookings} onUpdate={fetchBookings} onDelete={handleDelete} onCustomerCancel={handleCustomerCancel} />;
};

export default Bookings;