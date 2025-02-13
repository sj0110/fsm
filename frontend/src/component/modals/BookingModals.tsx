import { endpoints } from "@/config/api";
import { SharedModal } from "./SharedModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingModalProps, BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Mapping of internal status values to display labels
const statusOptions: { [key: string]: string } = {
  pending: "Pending",
  confirmed: "Confirmed",
  inProgress: "In Progress", // Added this line
  cancelled: "Cancelled",
  completed: "Completed",
};

export const BookingModal: React.FC<BookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
  mode,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // When using setSelectedStatus
const handleStatusChange = (value: string) => {
  setSelectedStatus(value as BookingStatus);
};

  const handleStatusUpdate = async () => {
    if (selectedStatus === booking.status) {
      onClose();
      return;
    }

    setIsUpdating(true);
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await fetch(endpoints.bookings.update(booking._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        onSuccess?.();
        onClose();
      } else {
        const error = await response.json();
        console.error('Status update failed:', error);
      }
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'Booking Details' : 'Edit Booking'}
    >
      <div className="space-y-4">
        <p><strong>Service:</strong> {booking.serviceId}</p>
        <p><strong>Date:</strong> {new Date(booking.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {statusOptions[booking.status]}</p>
        {mode === 'edit' && (
          <div className="space-y-4">
            <Select 
              value={selectedStatus} 
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{statusOptions[selectedStatus]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || selectedStatus === booking.status}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SharedModal>
  );
};
