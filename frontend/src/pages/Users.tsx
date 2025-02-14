import { useState, useEffect } from 'react';
import { User } from '@/types';
import { endpoints } from '@/config/api';
import UserTable from '@/component/tables/UserTable';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserModal } from '../component/modals/UserModals';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const emptyUser: User = {
    _id: '',
    name: '',
    email: '',
    role: 'customer'
  };

  const handleDelete = async (userId: string) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication Error: Please log in first');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoints.users.delete(userId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData?.message || `Failed to delete user: ${response.statusText}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const fetchUsers = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Please login to view users');
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
      toast.error((error as Error).message);
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

  return (
    <div className="space-y-6">
      {/* Admin Only: Add User Button */}
      {user?.role === 'admin' && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      )}

      {/* User Table or Empty State */}
      {users.length > 0 ? (
        <UserTable
          users={users}
          onUpdate={fetchUsers}
          onDelete={handleDelete}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
          No users available
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <UserModal
          user={emptyUser}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchUsers}
          mode="edit"
        />
      )}
    </div>
  );
};

export default Users;