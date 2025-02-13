import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string | Date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return (
    <div className="flex flex-col">
      <span>{dateObj.toLocaleDateString()}</span>
      <span className="text-sm text-gray-500">
        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};