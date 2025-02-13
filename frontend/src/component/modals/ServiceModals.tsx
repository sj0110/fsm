import { useState } from 'react';
import { Service, User } from '@/types';
import { endpoints } from '@/config/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SharedModal } from './SharedModal';

interface ServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'view' | 'edit' | 'book';
  serviceProviders?: User[];
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
  mode,
  serviceProviders,
}) => {
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    serviceProviderId: service.serviceProviderId,
    appointmentDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');

    try {
      let response;
      if (mode === 'edit') {
        response = await fetch(endpoints.services.update(service._id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
        });
      } else if (mode === 'book') {
        response = await fetch(endpoints.bookings.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            serviceId: service._id,
            appointmentDate: formData.appointmentDate,
          }),
        });
      }

      if (response?.ok) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'Service Details' : mode === 'edit' ? 'Edit Service' : 'Book Service'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'view' ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {service.name}</p>
            <p><strong>Description:</strong> {service.description}</p>
            <p><strong>Duration:</strong> {service.duration} minutes</p>
            <p><strong>Price:</strong> ${service.price}</p>
          </div>
        ) : mode === 'edit' ? (
          <>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Service Name"
            />
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
            />
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              placeholder="Duration (minutes)"
            />
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="Price"
            />
            <Select
              value={formData.serviceProviderId}
              onValueChange={(value) => setFormData({ ...formData, serviceProviderId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service Provider" />
              </SelectTrigger>
              <SelectContent>
                {serviceProviders?.map((provider) => (
                  <SelectItem key={provider._id} value={provider._id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <Input
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
          />
        )}
        {mode !== 'view' && (
          <Button type="submit" className="w-full">
            {mode === 'edit' ? 'Save Changes' : 'Book Now'}
          </Button>
        )}
      </form>
    </SharedModal>
  );
};