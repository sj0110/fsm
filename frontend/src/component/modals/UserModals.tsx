import { endpoints } from "@/config/api";
import { useState } from "react";
import { SharedModal } from "./SharedModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import bcrypt from 'bcryptjs';
import { toast } from 'react-toastify'

interface UserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'view' | 'edit';
}

export const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = localStorage.getItem('authToken');

    let updatedFormData = { ...formData };

    // Hash the password if provided
    if (formData.password) {
      console.log(formData.password);
      const salt = await bcrypt.genSalt(10);
      updatedFormData.password = await bcrypt.hash(formData.password, salt);
      console.log(updatedFormData.password);
    }

    try {
      let response;

      if (user._id) {
        // Update existing user
        response = await fetch(endpoints.users.update(user._id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedFormData),
        });
      } else {
        // Create new user
        // Password is required for new users
        if (!formData.password) {
          toast.error('Password is required for new users');
          return;
        }

        response = await fetch(endpoints.users.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedFormData),
        });
      }

      if (response.ok) {
        const message = user._id ? 'User updated successfully' : 'User created successfully';
        toast.success(message);
        onSuccess?.();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'User Details' : 'Edit User'}
    >
      {mode === 'view' ? (
        <div className="space-y-3 p-4 text-gray-700">
          <p className="text-sm"><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p className="text-sm"><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p className="text-sm"><strong>Role:</strong> {user?.role || "N/A"}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <Input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="New Password (leave blank to keep current)"
            className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as "admin" | "customer" | "serviceProvider" })}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="serviceProvider">Service Provider</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
            Save Changes
          </Button>
        </form>
      )}
    </SharedModal>

  );
};