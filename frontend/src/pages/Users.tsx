import { useState, useEffect } from 'react';
import { User } from '@/types';
import { endpoints } from '@/config/api';
import UserTable from '@/component/tables/UserTable';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/services" replace />;
  }

  const fetchUsers = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to view users",
      });
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

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <UserTable users={users} onUpdate={fetchUsers} />;
};

export default Users;
