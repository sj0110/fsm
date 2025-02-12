import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { endpoints } from '../config/api';
import { Booking } from '../types';

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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">
              Booking #{booking.id}
            </h3>
            <p className="text-gray-600">Service: {booking.serviceName}</p>
            <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p className="text-gray-600">Status: {booking.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
