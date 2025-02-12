import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { MoreHorizontal, Plus } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { endpoints } from '../../config/api';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  providerId?: string;
}

const ServiceTable: React.FC<{ services: Service[] }> = ({ services }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookService = async (serviceId: string) => {
    try {
      const response = await fetch(endpoints.bookings.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          serviceId,
          status: 'pending'
        })
      });
      
      if (!response.ok) {
        throw new Error('Booking failed');
      }
      
      navigate('/bookings');
    } catch (error) {
      console.error('Error booking service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const response = await fetch(endpoints.services.delete(serviceId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Refresh the services list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div>
      {user?.role === 'admin' && (
        <Button 
          onClick={() => navigate('/services/new')}
          className="mb-4"
        >
          <Plus className="mr-2 h-4 w-4" /> New Service
        </Button>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>${service.price}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/services/${service.id}`)}>
                      View Details
                    </DropdownMenuItem>
                    {user?.role === 'customer' && (
                      <DropdownMenuItem onClick={() => handleBookService(service.id)}>
                        Book Service
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate(`/services/${service.id}/edit`)}>
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          Delete Service
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};