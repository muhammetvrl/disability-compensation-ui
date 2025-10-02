import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React from "react";

interface TableWrapperProps<T> {
  data: T[];
  columns: {
    uid: string;
    name: string;
  }[];
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  rowKey?: keyof T;
}

export function TableWrapper<T extends { [key: string]: React.ReactNode }>({ 
  data, 
  columns, 
  renderCell,
  rowKey = 'id'
}: TableWrapperProps<T>) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Dynamic table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={String(item[rowKey])}>
              {(columnKey) => (
                <TableCell>
                  {renderCell ? renderCell(item, columnKey.toString()) : item[columnKey]}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
