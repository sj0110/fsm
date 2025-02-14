import { useState, useEffect } from 'react';
import { Service } from '@/types';
import { endpoints } from '@/config/api';
import ServiceTable from '@/component/tables/ServiceTable';
import { useToast } from "@/hooks/use-toast"

const Services = () => {

  useEffect(() => {
    fetchServices();
  }, []);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleDelete = async (selectedServiceId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in first",
      });
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
        toast({
          variant: "default",
          title: "Service Deleted",
          description: "The service has been deleted successfully",
        });
        setServices(services.filter(service => service._id !== selectedServiceId));
      } else {
        throw new Error('Failed to delete service');
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


  const fetchServices = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to view services",
      });
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
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch services",
      });
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
