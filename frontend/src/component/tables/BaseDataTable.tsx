import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { BaseDataTableProps, SortConfig } from '@/types';

export function BaseDataTable<T extends { _id: string }>({
  data,
  columns,
  actions,
  defaultSort = { key: '_id' as keyof T, direction: 'desc' }
}: BaseDataTableProps<T> & { defaultSort?: SortConfig<T> }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(defaultSort);
  const [searchQuery, setSearchQuery] = useState('');
  const [processedData, setProcessedData] = useState<T[]>(data);


  // Process data with sorting and filtering
  useEffect(() => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter(item => {
        return columns.some(column => {
          const value = item[column.accessorKey as keyof T];
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v =>
              String(v).toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      const getComparisonValue = (value: any) => {
        if (typeof value === 'object' && value !== null) {
          return value.name || '';
        }
        return value;
      };

      const aCompare = getComparisonValue(aValue);
      const bCompare = getComparisonValue(bValue);

      if (aCompare < bCompare) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aCompare > bCompare) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProcessedData(result);
    setCurrentPage(1);
  }, [data, searchQuery, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = processedData.slice(startIndex, endIndex);

  const handleSort = (key: keyof T) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const previousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessorKey)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={() => handleSort(column.accessorKey)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {sortConfig.key === column.accessorKey && (
                      sortConfig.direction === 'asc' ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="px-4 py-2 text-sm font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <TableRow
                  key={item._id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)} className="px-4 py-2">
                      {column.cell
                        ? column.cell(item[column.accessorKey])
                        : String(item[column.accessorKey])}
                    </TableCell>
                  ))}
                  <TableCell
                    className="px-4 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {actions
                          .filter((action) =>
                            action.showCondition ? action.showCondition(item) : true
                          )
                          .map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              onClick={() => action.onClick(item)}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="px-4 py-6 text-center text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {processedData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">Rows per page:</p>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BaseDataTable;