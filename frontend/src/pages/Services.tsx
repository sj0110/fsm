import { useState, useEffect } from 'react';
import { Service } from '@/types';
import { endpoints } from '@/config/api';
import ServiceTable from '@/component/tables/ServiceTable';
import { toast } from "react-toastify";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ServiceModal } from '../component/modals/ServiceModals';

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const emptyService: Service = {
    _id: '',
    name: '',
    description: '',
    duration: 0,
    price: 0,
    serviceProviderId: '',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
        const errorData = await response.json();
        const errorMessage = errorData?.message || `Failed to delete service: ${response.statusText}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error((error as Error).message);
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
      let url = endpoints.services.getAll;

      // If the user is a service provider, fetch only their services
      if (user?.role === 'serviceProvider') {
        url += `?serviceProviderId=${user._id}`;
      }

      const response = await fetch(url, {
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

  return (
    <div className="space-y-6">
      {/* Heading and Add Service Button (Admin Only for Button) */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Services Table</h2>
        {user?.role === 'admin' && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>

      {/* Service Table or Empty State */}
      {services.length > 0 ? (
        <ServiceTable
          services={services}
          onUpdate={fetchServices}
          onDelete={handleDelete}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
          No services available
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <ServiceModal
          service={emptyService}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchServices}
          mode="edit"
        />
      )}
    </div>

  );
};

export default Services;