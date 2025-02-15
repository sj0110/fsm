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
  const [dateError, setDateError] = useState<string>('');

  const [isFormModified, setIsFormModified] = useState(false);

  // Function to get minimum allowed datetime (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
    return now.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
  };

  // Function to validate if selected date is in the future
  const isValidFutureDate = (dateString: string): boolean => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate > now;
  };

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
    if (field === 'appointmentDate') {
      // Clear previous error
      setDateError('');

      // Validate date if it's the appointment date field
      if (!isValidFutureDate(value as string)) {
        setDateError('Please select a future date and time');
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    setIsFormModified(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Additional validation for appointment date
    if (mode === 'book' && !isValidFutureDate(formData.appointmentDate)) {
      setDateError('Please select a future date and time');
      return;
    }

    // Check if form should be submitted
    const shouldSubmit = !(
      isLoading ||
      (mode === 'edit' && !isFormModified) ||
      (mode === 'edit' && !hasChanges()) ||
      (mode === 'book' && !formData.appointmentDate) ||
      (mode === 'book' && dateError)
    );

    if (!shouldSubmit) {
      return;
    }

    setIsLoading(true);
    const authToken = localStorage.getItem('authToken');
    const { _id, appointmentDate, ...filteredFormData } = formData;

    try {
      let response;

      if (mode === 'edit') {
        if (service._id) {
          // If service has an ID, it's an edit operation
          response = await fetch(endpoints.services.update(service._id), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(filteredFormData),
          });
        } else {
          // If no ID, it's a creation operation
          response = await fetch(endpoints.services.create, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(filteredFormData),
          });
        }
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
        const message =
          mode === 'edit'
            ? service._id
              ? 'Service updated successfully'
              : 'Service created successfully'
            : 'Your appointment has been booked successfully';

        toast.success(message);
        onSuccess?.();
        onClose();
      } else {
        const errorData = response ? await response.json() : { message: 'Unknown error occurred' };
        throw new Error(errorData.message || 'Operation failed');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };


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
      title={
        mode === "view"
          ? "Service Details"
          : mode === "edit"
            ? "Edit Service"
            : "Book Service"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        {mode === "view" ? (
          service ? (
            <div className="space-y-3 text-sm md:text-base">
              <p><strong>Name:</strong> {service.name || "No name available"}</p>
              <p><strong>Description:</strong> {service.description || "No description available"}</p>
              <p><strong>Duration:</strong> {service.duration ? `${service.duration} minutes` : "No duration available"}</p>
              <p><strong>Price:</strong> {service.price ? `$${service.price}` : "No price available"}</p>
              <p><strong>Service Provider:</strong> {service?.serviceProvider?.name || "N/A"}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No service details available</p>
          )
        ) : mode === "edit" ? (
          <>
            <div className="space-y-2">
              <label htmlFor="serviceName" className="font-medium">Service Name:</label>
              <Input
                id="serviceName"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter service name"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="font-medium">Description:</label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter description"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="duration" className="font-medium">Duration (minutes):</label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
                placeholder="Duration (minutes)"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="font-medium">Price:</label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                placeholder="Enter price"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="serviceProvider" className="font-medium">Service Provider:</label>
              {serviceProviders.length > 0 ? (
                <Select
                  value={formData.serviceProviderId}
                  onValueChange={(value) => handleInputChange("serviceProviderId", value)}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md p-2">
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
              ) : (
                <p className="text-gray-500 text-sm">No service providers available</p>
              )}
            </div>
          </>
        ) : (
          mode === "book" && (
            <div className="space-y-2">
              <label htmlFor="appointmentDate" className="font-medium">Select Date and Time:</label>
              <Input
                id="appointmentDate"
                type="datetime-local"
                value={formData.appointmentDate}
                onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                min={getMinDateTime()} // Set minimum datetime to current time
                className={`w-full rounded-md border p-2 ${dateError ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {dateError && (
                <p className="text-sm text-red-500 mt-1">{dateError}</p>
              )}
            </div>
          )
        )}

        {mode !== "view" && (
          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                (mode === "edit" && !isFormModified) ||
                (mode === "edit" && !hasChanges()) ||
                (mode === "book" && (!formData.appointmentDate || !!dateError))
              }
              className="w-full md:w-auto"
            >
              {isLoading ? "Processing..." : mode === "edit" ? "Save Changes" : "Book Now"}
            </Button>
          </div>
        )}
      </form>
    </SharedModal>

  );
};