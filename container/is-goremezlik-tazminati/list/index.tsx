"use client";
import { Button, DatePicker, Link, Select, SelectItem, Pagination } from "@heroui/react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { TableWrapper } from "@/components/table/table";
import { columns } from "../common/data";
import { RenderCell } from "../common/render-cell";
import { ROUTES } from "@/helpers/urls";
import { compensationService } from "@/services/compensations";
import { DateValue } from "@internationalized/date";
import { SearchXIcon } from "lucide-react";
import { I18nProvider } from "@react-aria/i18n";

export const IncapacityCompensation = () => {
  const [selectedStatus, setSelectedStatus] = useState<Set<string>>(
    new Set([])
  );

  const [filter, setFilter] = useState<{
    date: DateValue | null;
    status: number | null;
    page: number;
    pageSize: number;
  }>({
    date: null,
    status: null,
    page: 1,
    pageSize: 10,
  });

  const status = [
    { label: "Tümü", key: 0 },
    { label: "Beklemede", key: 1 },
    { label: "Onaylandı", key: 2 },
    { label: "Reddedildi", key: 3 },
  ];

  const pageSizeOptions = [
    { label: "10", key: 10 },
    { label: "25", key: 25 },
    { label: "50", key: 50 },
    { label: "100", key: 100 },
  ];

  const [selectedPageSize, setSelectedPageSize] = useState<Set<string>>(
    new Set(["10"])
  );

  const [compensations, setCompensations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    console.log(filter);
    const fetchData = async () => {
      const res = await compensationService.list(filter as any);
      setCompensations(res.items || []);
      setTotalPages(res.totalPage || 1);
      setTotalItems(res.totalRecords || 0);
    };

    fetchData();
  }, [filter]);

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  const clearSearch = () => {
    setFilter({
      date: null,
      status: null,
      page: 1,
      pageSize: 10,
    });
    setSelectedStatus(new Set([]));
    setSelectedPageSize(new Set(["10"]));
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs radius={"sm"} variant="solid">
        <BreadcrumbItem>Anasayfa</BreadcrumbItem>
        <BreadcrumbItem>İş Göremezlik Tazminatı</BreadcrumbItem>
        <BreadcrumbItem>Liste</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">İş Göremezlik Tazminatı</h3>
        <p className="text-sm text-gray-500">
          Toplam {totalItems} kayıt bulundu
        </p>
      </div>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3">
          <I18nProvider locale="tr-TR">
            <DatePicker
              value={filter.date as any}
              onChange={(value) => {
                setFilter({ ...filter, date: value as any, page: 1 });
              }}
              className="w-[200px]"
              label="Tazminat Tarihi"
            />
          </I18nProvider>
          <Select
            className="w-[200px]"
            items={status}
            label="Durum"
            placeholder="Durum"
            selectedKeys={selectedStatus}
            onSelectionChange={(keys: any) => {
              setSelectedStatus(keys as Set<string>);
              const selectedValue = Array.from(keys)[0];
              setFilter({
                ...filter,
                status: selectedValue ? Number(selectedValue) : null,
                page: 1, // Reset to first page when filter changes
              });
            }}
          >
            {(status: any) => <SelectItem>{status.label}</SelectItem>}
          </Select>
          <Select
            className="w-[120px]"
            items={pageSizeOptions}
            label="Sayfa Boyutu"
            placeholder="10"
            selectedKeys={selectedPageSize}
            onSelectionChange={(keys: any) => {
              setSelectedPageSize(keys as Set<string>);
              const selectedValue = Array.from(keys)[0];
              setFilter({
                ...filter,
                pageSize: selectedValue ? Number(selectedValue) : 10,
                page: 1, // Reset to first page when page size changes
              });
            }}
          >
            {(option: any) => <SelectItem>{option.label}</SelectItem>}
          </Select>
          <SearchXIcon
            className="cursor-pointer"
            onClick={() => clearSearch()}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button
            showAnchorIcon
            as={Link}
            color="primary"
            href={ROUTES.IS_GOREMEZLIK.NEW}
            variant="solid"
          >
            Yeni Tazminat Hesapla
          </Button>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper
          data={compensations}
          columns={columns}
          renderCell={(rowData, columnKey) =>
            RenderCell({ rowData, columnKey })
          }
        />
        
        {totalPages > 1 && (
          <div className="flex justify-end mt-4">
            <Pagination
              total={totalPages}
              page={filter.page}
              onChange={handlePageChange}
              showControls
              showShadow
              color="primary"
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
