import { useState } from 'react';
import { User } from '@/types';
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
  
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role' },
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
         // @ts-ignore
        columns={columns}
        actions={getActions()}
        basePath="/users"
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