// import { useNavigate } from 'react-router-dom';
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
import { MoreHorizontal } from "lucide-react";
import { BaseDataTableProps } from '@/types';


export function BaseDataTable<T extends { _id: string }>({
  data,
  columns,
  actions,
  // basePath,
  // onRowClick,
}: BaseDataTableProps<T>) {
  // const navigate = useNavigate();

  // const handleRowClick = (item: T) => {
  //   if (onRowClick) {
  //     onRowClick(item);
  //   } else {
  //     navigate(`${basePath}/${item._id}`);
  //   }
  // };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-full">
        {/* Table Headings */}
        <TableHeader className="bg-gray-100">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.accessorKey)}
                className="px-4 py-2 text-sm font-semibold text-gray-700"
              >
                {column.header}
              </TableHead>
            ))}
            <TableHead className="px-4 py-2 text-sm font-semibold text-gray-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
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

  );
}