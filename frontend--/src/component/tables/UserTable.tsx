// src/components/tables/UserTable.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BaseDataTable } from './BaseDataTable';
import { User } from '@/types';
import { endpoints } from '@/config/api';
import { useEffect, useState } from 'react';

const columns: { header: string; accessorKey: keyof User }[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Role', accessorKey: 'role' },
];

export default function UserTable({ users }: { users: User[] }) {
  const [userEntries, setUserEntries] = useState<User[] | []>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(()=>{
    setUserEntries(users)
  }, [])

  console.log('user', users)

  const handleDelete = async (selectedUser: User) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch(endpoints.users.delete(selectedUser._id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log(users.filter(user => user._id != selectedUser._id))
      setUserEntries(users.filter(user => user._id != selectedUser._id))

      // if (response.ok) {
      //   // Refresh the page or update the state
      //   window.location.reload();
      // }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const actions = user?.role === 'admin' ? [
    {
      label: 'View Details',
      onClick: (selectedUser: User) => navigate(`/users/${selectedUser._id}`),
    },
    {
      label: 'Edit',
      onClick: (selectedUser: User) => navigate(`/users/${selectedUser._id}/edit`),
    },
    {
      label: 'Delete',
      onClick: handleDelete,
    },
  ] : [];

  return (
    <BaseDataTable
      data={userEntries}
      columns={columns}
      actions={actions}
      basePath="/users"
    />
  );
}