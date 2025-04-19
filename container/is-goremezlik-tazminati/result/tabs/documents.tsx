"use client";
import React from "react";
import { TableWrapper } from "@/components/table/table";
import { Button, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { formatDateString } from "@/utils/formatDate";

interface DocumentType {
    id: string;
    expenseType: string;
    referenceNo: string;
    date: string;
    amount: string | number | null;
    filePath: string;
    [key: string]: React.ReactNode | string | number | null;
}

export const Documents = ({ detail }: { detail: any }) => {

    const columns = [
        { uid: "expenseType", name: "Belge Adı" },
        { uid: "referenceNo", name: "Referans" },
        { uid: "date", name: "Tarih" },
        { uid: "amount", name: "Tutar" },
        { uid: "actions", name: "" }
    ];


    // Custom cell renderer to handle the view button
    const renderCell = (item: DocumentType, columnKey: string) => {
        switch (columnKey) {
            case "actions":
                return (
                    <div className="flex justify-end">
                        <a
                            href={item.filePath.startsWith('http') ? item.filePath : `http://${item.filePath}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Tooltip content="Details">
                                <EyeIcon size={20} fill="#979797" />
                            </Tooltip>
                        </a>
                    </div>
                );
            case "amount":
                return item.amount === "-" ? "-" : `${item?.amount ?? 0}`;
            case "date":
                return formatDateString(item.date);
            default:
                return item[columnKey as keyof DocumentType];
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <TableWrapper<DocumentType>
                columns={columns}
                data={[...detail?.documents?.map((doc: any) => ({ ...doc, expenseType: doc.documentType })), ...detail?.expenses]}
                renderCell={renderCell}
                rowKey="id"
            />
        </div>
    );
};
