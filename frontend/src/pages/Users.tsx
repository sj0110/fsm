import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { endpoints } from '../config/api';
import { User } from '../types';

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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-2 text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
