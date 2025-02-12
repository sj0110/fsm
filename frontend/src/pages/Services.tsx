import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { endpoints } from '../config/api';
import { Service } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(endpoints.services.getAll, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data: Service[] = await response.json();
        if (response.ok) {
          setServices(data);
        } else {
          setError('Failed to fetch services');
        }
      } catch (err) {
        setError('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Services</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <p className="mt-2 font-bold">${service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
