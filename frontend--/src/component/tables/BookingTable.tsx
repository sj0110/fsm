import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { endpoints } from '../../config/api';
import { Booking } from '@/types';

const BookingTable: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    throw new Error("User not authenticated");
  }

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(endpoints.bookings.update(bookingId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Status update failed');
      }

      // window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(endpoints.bookings.delete(bookingId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Deletion failed');
      }

      // window.location.reload();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Booking ID</TableHead>
          <TableHead>Service ID</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow
            key={booking._id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/bookings/${booking._id}`)}
          >
            <TableCell>{booking._id}</TableCell>
            <TableCell>{booking.serviceId}</TableCell>
            <TableCell>
              {new Date(booking.appointmentDate).toLocaleDateString()}
              <div className="text-sm text-gray-500">
                {new Date(booking.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </TableCell>
            <TableCell>
              {(user?.role === 'serviceProvider' || user?.role === 'admin') ? (
                <Select
                  value={booking.status}
                  onValueChange={(value) => handleUpdateStatus(booking._id, value)}
                >
                  <SelectTrigger onClick={(e) => e.stopPropagation()}>
                    <SelectValue>{booking.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className={`px-2 py-1 rounded-full text-sm ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                  }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/bookings/${booking._id}`);
                  }}>
                    View Details
                  </DropdownMenuItem>
                  {((user?.role === 'customer' && booking.status === 'pending') ||
                    user?.role === 'admin') && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBooking(booking._id);
                        }}
                      >
                        Cancel Booking
                      </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;