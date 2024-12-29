import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

interface TableWrapperProps<T> {
  data: T[];
  columns: {
    uid: string;
    name: string;
  }[];
  renderCell: (item: T, columnKey: string) => React.ReactNode;
}

export function TableWrapper<T>({ data, columns, renderCell }: TableWrapperProps<T>) {
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
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey.toString())}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
