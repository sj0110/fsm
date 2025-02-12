import React from 'react';
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

interface Booking {
  id: string;
  serviceName: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  date: string;
  userId: string;
}

const BookingTable: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(endpoints.bookings.update(bookingId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Status update failed');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(endpoints.bookings.delete(bookingId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Deletion failed');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.serviceName}</TableCell>
            <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
            <TableCell>
              {(user?.role === 'serviceProvider' || user?.role === 'admin') ? (
                <Select
                  value={booking.status}
                  onValueChange={(value) => handleUpdateStatus(booking.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue>{booking.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                booking.status
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(`/bookings/${booking.id}`)}>
                    View Details
                  </DropdownMenuItem>
                  {(user?.role === 'customer' && booking.status === 'pending' || user?.role === 'admin') && (
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteBooking(booking.id)}
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