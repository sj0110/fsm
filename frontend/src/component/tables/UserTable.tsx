import { useState } from 'react';
import { Column, User } from '@/types';
import { BaseDataTable } from './BaseDataTable';
import { UserModal } from '../modals/UserModals';
import { useAuth } from '@/context/AuthContext';

export default function UserTable({ 
  users, 
  onUpdate, 
  onDelete
}: { 
  users: User[], 
  onUpdate: () => void,
  onDelete: (userId: string) => Promise<void>
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const { user } = useAuth();

  const handleAction = (selectedUser: User, mode: 'view' | 'edit') => {
    setSelectedUser(selectedUser);
    setModalMode(mode);
  };
  
  const columns : Column<User>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role',
      cell: (role: string) => 
        role.replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
            .trim()
     },
  ];

  const getActions = () => {
    if (user?.role === 'admin') {
      return [
        {
          label: 'View Details',
          onClick: (user: User) => handleAction(user, 'view'),
        },
        {
          label: 'Update User Details',
          onClick: (user: User) => handleAction(user, 'edit'),
        },
        {
          label: 'Delete User',
          onClick: (user: User) => onDelete(user._id),
        }
      ];
    }
    return [];
  };

  return (
    <>
      <BaseDataTable
        data={users}
        columns={columns}
        actions={getActions()}
        defaultSort={{ key: 'name', direction: 'asc' }} // Sort users by name
        // basePath="/users"
      />
      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={onUpdate}
          mode={modalMode}
        />
      )}
    </>
  );
}