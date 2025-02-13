import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { endpoints } from '../config/api';
import { User } from '../types';
import UserTable from '@/component/tables/UserTable';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(endpoints.users.getAll, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data: User[] = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <UserTable users={users} />;
};

export default Users;
