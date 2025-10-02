import { Tooltip, Chip } from "@heroui/react";
import React from "react";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { formatDateString } from "@/utils/formatDate";
import { ROUTES } from "@/helpers/urls";
import Link from "next/link";

enum CompensationStatus {
  None = 0,
  Pending = 1,
  Approve = 2,
  Reject = 3
}

const getStatusClass = (status: CompensationStatus) => {
  switch (status) {
    case CompensationStatus.None:
      return "bg-gray-100 text-gray-800";
    case CompensationStatus.Pending:
      return "bg-yellow-100 text-yellow-800";
    case CompensationStatus.Approve:
      return "bg-green-100 text-green-800";
    case CompensationStatus.Reject:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: CompensationStatus) => {
  switch (status) {
    case CompensationStatus.None:
      return "Belirlenmedi";
    case CompensationStatus.Pending:
      return "Beklemede";
    case CompensationStatus.Approve:
      return "Onaylandı";
    case CompensationStatus.Reject:
      return "Reddedildi";
    default:
      return "Belirlenmedi";
  }
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

interface Props {
  rowData: any;
  columnKey: string | React.Key;
}

export const RenderCell = ({ rowData, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = typeof columnKey === 'string' 
    ? getNestedValue(rowData, columnKey)
    : rowData[columnKey];
    
  switch (columnKey) {
    case "claimant.name":
      return (
        <span>{cellValue} {rowData.claimant.surname}</span>
      );
    case "createdDate":
      return (
        <span>{formatDateString(cellValue)}</span>
      );
    case "status":
      return (
        <Chip className={`text-xs ${getStatusClass(cellValue)}`}>
          <span className="capitalize">{getStatusText(cellValue)}</span>
        </Chip>
      );
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Düzenle" color="secondary">
              <Link href={ROUTES.IS_GOREMEZLIK.DETAIL(rowData.id)}>
                <EditIcon size={20} fill="#979797" />
              </Link>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Sil"
              color="danger"
              onClick={() => console.log("Delete user", rowData.id)}
            >
              <button>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
