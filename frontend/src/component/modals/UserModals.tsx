import { endpoints } from "@/config/api";
import { useState } from "react";
import { SharedModal } from "./SharedModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { toast } from 'react-toastify';

interface UserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'view' | 'edit';
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'serviceProvider' | 'admin';
}

interface UpdateFormData {
  name?: string;
  email?: string;
  password?: string;
}

export const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
  mode,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    password: false,
    role: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        } else if (value.length < 2) {
          return 'Name must be at least 2 characters long';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        } else if (!validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      
      case 'password':
        if (!user._id && !value) {
          return 'Password is required for new users';
        } else if (value && value.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        break;
      
      case 'role':
        if (!user._id && !value) {
          return 'Role is required';
        }
        break;
    }
    return '';
  };

  const handleChange = (
    name: keyof FormData,
    value: string,
    shouldValidate: boolean = true
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (shouldValidate) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const authToken = localStorage.getItem('authToken');

    try {
      let response;

      if (user._id) {
        // Update existing user - only include necessary fields
        const updateData: UpdateFormData = {
          name: formData.name,
          email: formData.email,
        };
        
        // Only include password if it was changed
        if (formData.password) {
          updateData.password = formData.password;
        }

        response = await fetch(endpoints.users.update(user._id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(updateData),
        });
      } else {
        // Create new user - include all fields
        response = await fetch(endpoints.users.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'view' ? 'User Details' : (user._id ? 'Edit User' : 'Create User')}
    >
      {mode === 'view' ? (
        <div className="space-y-3 p-4 text-gray-700">
          <p className="text-sm"><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p className="text-sm"><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p className="text-sm">
            <strong>Role:</strong>{" "}
            {user?.role
              ? user.role
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim()
              : "N/A"}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Name"
              className={`w-full border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
              autoComplete='name'
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Email"
              type="email"
              className={`w-full border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
              autoComplete='email'
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder={user._id ? "New Password (leave blank to keep current)" : "Password"}
              className={`w-full border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}
              autoComplete="new-password"
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {!user._id && (
            <div>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger className={`w-full border ${touched.role && errors.role ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200`}>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="serviceProvider">Service Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {touched.role && errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>
          )}

          {/* {user._id && (
            <Alert variant="destructive" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                User role cannot be changed after creation
              </AlertDescription>
            </Alert>
          )} */}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (user._id ? 'Save Changes' : 'Create User')}
          </Button>
        </form>
      )}
    </SharedModal>
  );
};