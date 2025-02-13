// src/components/tables/ServiceTable.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BaseDataTable } from './BaseDataTable';
import { Service } from '@/types';
import { endpoints } from '@/config/api';

const columns: { header: string; accessorKey: keyof Service }[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Description', accessorKey: 'description' },
  { header: 'Price', accessorKey: 'price' },
];

export default function ServiceTable({ services }: { services: Service[] }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm('Are you sure you want to delete this service?');
    if (!confirmed) return;

    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch(endpoints.services.delete(service.id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      // if (response.ok) {
      //   window.location.reload();
      // }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleBook = (service: Service) => {
    navigate(`/bookings/new?serviceId=${service.id}`);
  };

  const getActions = () => {
    const baseActions = [
      {
        label: 'View Details',
        onClick: (service: Service) => navigate(`/services/${service.id}`),
      },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseActions,
        {
          label: 'Edit',
          onClick: (service: Service) => navigate(`/services/${service.id}/edit`),
        },
        {
          label: 'Delete',
          onClick: handleDelete,
        },
      ];
    }

    if (user?.role === 'customer') {
      return [
        ...baseActions,
        {
          label: 'Book Service',
          onClick: handleBook,
        },
      ];
    }

    return baseActions; // For service provider, only view action
  };

  return (
    <BaseDataTable
      data={services}
      columns={columns}
      actions={getActions()}
      basePath="/services"
    />
  );
}