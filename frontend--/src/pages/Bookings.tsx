import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { endpoints } from '../config/api';
import { Booking } from '../types';
import BookingTable from '@/component/tables/BookingTable';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(endpoints.bookings.getAll, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data: Booking[] = await response.json();
        if (response.ok) {
          console.log(data);
          setBookings(data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <BookingTable bookings={bookings} />;
};

export default Bookings;
