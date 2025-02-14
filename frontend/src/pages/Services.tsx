import { useState, useEffect } from 'react';
import { Service } from '@/types';
import { endpoints } from '@/config/api';
import ServiceTable from '@/component/tables/ServiceTable';
import { toast } from "react-toastify"

const Services = () => {

  useEffect(() => {
    fetchServices();
  }, []);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (selectedServiceId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication Error: Please log in first');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(endpoints.services.delete(selectedServiceId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        toast.success('The service has been deleted successfully');
        setServices(services.filter(service => service._id !== selectedServiceId));
      } else {
        // Attempt to parse the error message from the response body
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const errorData = isJson ? await response.json() : null;
        const errorMessage = errorData?.message || `Failed to delete service: ${response.statusText}`;
        // throw new Error(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const err = error as Error;
      // console.error('Error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchServices = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Please login to view services');
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

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        toast.error('Failed to fetch services');
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ServiceTable services={services} onUpdate={fetchServices} onDelete={handleDelete} />;
};

export default Services;
