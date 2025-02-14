import { useState, useEffect } from 'react';
import { ServiceModalProps, User } from '@/types';
import { endpoints } from '@/config/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SharedModal } from './SharedModal';
import { toast } from "react-toastify"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
  mode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceProviders, setServiceProviders] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    _id: service._id,
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    serviceProviderId: service.serviceProviderId || '',
    appointmentDate: '',
  });

  const [isFormModified, setIsFormModified] = useState(false);

  const hasChanges = () => {
    return (
      formData.name !== service.name ||
      formData.description !== service.description ||
      formData.duration !== service.duration ||
      formData.price !== service.price ||
      formData.serviceProviderId !== service.serviceProviderId
    );
  };

  useEffect(() => {
    if (mode === 'edit' && isOpen) {
      fetchServiceProviders();
    }
  }, [mode, isOpen]);

  const fetchServiceProviders = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    try {
      const response = await fetch(endpoints.users.getAllServiceProviders, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServiceProviders(data);
      } else {
        throw new Error('Failed to fetch service providers');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsFormModified(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    
    // Check if form should be submitted
    const shouldSubmit = !(
      isLoading ||
      (mode === 'edit' && !isFormModified) ||
      (mode === 'edit' && !hasChanges()) ||
      (mode === 'book' && !formData.appointmentDate)
    );

    if (!shouldSubmit) {
      return;
    }

    setIsLoading(true);
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
            serviceId: formData._id.toString(),
            appointmentDate: formData.appointmentDate,
          }),
        });
      }

      if (response?.ok) {
        const message = mode === 'edit' ? 'Service details have been updated successfully' : 'Your appointment has been booked successfully';
        toast.success(message);
        onSuccess?.();
        onClose();
      } else {
        throw new Error(mode === 'edit' ? 'Failed to update service' : 'Failed to book service');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle button click separately to prevent form submission on Cancel
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.type !== 'submit') {
      e.preventDefault();
      onClose();
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
            <div className="space-y-2">
              <label htmlFor="serviceName">Service Name:</label>
              <Input
                id="serviceName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Service Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Description:</label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="duration">Duration (minutes):</label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                placeholder="Duration (minutes)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price">Price:</label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="Price"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="serviceProvider">Service Provider:</label>
              <Select
                value={formData.serviceProviderId}
                onValueChange={(value) => handleInputChange('serviceProviderId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Service Provider" />
                </SelectTrigger>
                <SelectContent>
                  {serviceProviders.map((provider) => (
                    <SelectItem key={provider._id} value={provider._id}>
                      <div className="flex items-center">
                        <span>{provider.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ID: {provider._id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <label htmlFor="appointmentDate">Select Date and Time:</label>
            <Input
              id="appointmentDate"
              type="datetime-local"
              value={formData.appointmentDate}
              onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
            />
          </div>
        )}
        {mode !== 'view' && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button" // Changed to type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                (mode === 'edit' && !isFormModified) ||
                (mode === 'edit' && !hasChanges()) ||
                (mode === 'book' && !formData.appointmentDate)
              }
            >
              {isLoading ? 'Processing...' : mode === 'edit' ? 'Save Changes' : 'Book Now'}
            </Button>
          </div>
        )}
      </form>
    </SharedModal>
  );
};