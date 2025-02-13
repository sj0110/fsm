import { endpoints } from "@/config/api";
import { useState } from "react";
import { SharedModal } from "./SharedModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

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
  
      try {
        const response = await fetch(endpoints.users.update(user._id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          onSuccess?.();
          onClose();
        }
      } catch (error) {
        console.error('Update failed:', error);
      }
    };
  
    return (
      <SharedModal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === 'view' ? 'User Details' : 'Edit User'}
      >
        {mode === 'view' ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="New Password (leave blank to keep current)"
            />
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as "admin" | "customer" | "serviceProvider"})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="serviceProvider">Service Provider</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        )}
      </SharedModal>
    );
  };