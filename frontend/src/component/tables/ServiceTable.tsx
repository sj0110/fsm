


// src/components/tables/ServiceTable.tsx
import { useState } from 'react';
import { Column, Service } from '@/types';
import { BaseDataTable } from './BaseDataTable';
import { ServiceModal } from '../modals/ServiceModals';
import { useAuth } from '@/context/AuthContext';

export default function ServiceTable({ services, onUpdate, onDelete }: { services: Service[], onUpdate: () => void, onDelete: (bookingId: string) => Promise<void>; }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'book'>('view');
  const { user } = useAuth();

  const handleAction = (service: Service, mode: 'view' | 'edit' | 'book') => {
    setSelectedService(service);
    setModalMode(mode);
  };

  const columns: Column<Service>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' },
    { header: 'Duration (min)', accessorKey: 'duration' },
    { header: 'Price', 
      accessorKey: 'price',
      cell: (price: number) => `$${price.toFixed(2)}`
    },
    { header: 'Service Provider', 
      accessorKey: 'serviceProvider',
      cell: (provider: { name: string } | undefined) => provider?.name || 'N/A'
    },
  ];

  const getActions = () => {
    const baseActions = [
      {
        label: 'View Details',
        onClick: (service: Service) => handleAction(service, 'view'),
      },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseActions,
        {
          label: 'Edit Details',
          onClick: (service: Service) => handleAction(service, 'edit'),
        },
        {
          label: 'Delete Service',
          onClick: (service: Service) => onDelete(service._id)
        },
      ];
    }

    if (user?.role === 'customer') {
      return [
        ...baseActions,
        {
          label: 'Book Service',
          onClick: (service: Service) => handleAction(service, 'book'),
        },
      ];
    }

    return baseActions;
  };

  return (
    <>
      <BaseDataTable
        data={services}
        columns={columns}
        actions={getActions()}
        defaultSort={{ key: 'name', direction: 'asc' }} // Sort services by name
        // basePath="/services"
      />
      {selectedService && (
        <ServiceModal
          service={selectedService} // Currently selected service
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={onUpdate}
          mode={modalMode}
        />
      )}
    </>
  );
}
