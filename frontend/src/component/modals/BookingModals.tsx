import { endpoints } from "@/config/api";
import { SharedModal } from "./SharedModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingModalProps, BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { statusOptions } from "@/lib/utils";

export const BookingModal: React.FC<BookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
  mode,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as BookingStatus);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      title={mode === "view" ? "Booking Details" : "Edit Booking"}
    >
      {booking ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <p className="text-sm md:text-base">
            <strong>Service:</strong> {booking.serviceId || "No service available"}
          </p>
          <p className="text-sm md:text-base">
            <strong>Date:</strong> {booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleString() : "No date available"}
          </p>
          <p className="text-sm md:text-base">
            <strong>Status:</strong> {statusOptions[booking.status] || "No status available"}
          </p>

          {mode === "edit" && (
            <div className="space-y-4">
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 text-sm md:text-base">
                  <SelectValue>{statusOptions[selectedStatus] || "Select Status"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusOptions).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleButtonClick}
                  disabled={isUpdating}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || selectedStatus === booking.status}
                  className="w-full md:w-auto"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <p className="text-center text-gray-500 py-4">No booking details available</p>
      )}
    </SharedModal>

  );
};