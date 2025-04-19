"use client";
import { Button, DatePicker, Link, Select, SelectItem } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
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
  const [selectedStatus, setSelectedStatus] = useState<Set<string>>(new Set([]));
  
  const [filter, setFilter] = useState<{ date: DateValue | null, status: number | null, page: number, pageSize: number }>({
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

  const [compensations, setCompensations] = useState([]);

  useEffect(() => {
    console.log(filter)
    const fetchData = async () => {
      const res = await compensationService.list(filter);
      setCompensations(res.items || []);
    };

    fetchData();
  }, [filter]);

  const clearSearch = () => {
    setFilter({
      date: null,
      status: null,
      page: 1,
      pageSize: 10,
    });
    setSelectedStatus(new Set([]));
  };

  // DatePicker'dan gelen tarihi UTC'ye çeviren yardımcı fonksiyon
  const convertToUTCDate = (date: DateValue | null) => {
    if (!date) return null;
    
    // DateValue'yu JavaScript Date nesnesine çeviriyoruz
    const localDate = new Date(date.toString());
    
    // Tarihi UTC'ye çeviriyoruz
    return new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds()
    ));
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs radius={"sm"} variant="solid">
        <BreadcrumbItem>Anasayfa</BreadcrumbItem>
        <BreadcrumbItem>İş Göremezlik Tazminatı</BreadcrumbItem>
        <BreadcrumbItem>Liste</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold">İş Göremezlik Tazminatı</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3">
          <I18nProvider locale="tr-TR">
            <DatePicker
              value={filter.date}
              onChange={(value) => {
                const utcDate = convertToUTCDate(value);
                setFilter({ ...filter, date: utcDate as DateValue | null });
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
            onSelectionChange={(keys) => {
              setSelectedStatus(keys as Set<string>);
              const selectedValue = Array.from(keys)[0];
              setFilter({ ...filter, status: selectedValue ? Number(selectedValue) : null });
            }}
          >
            {(status) => <SelectItem>{status.label}</SelectItem>}
          </Select>
          <SearchXIcon className="cursor-pointer" onClick={() => clearSearch()} />
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
          renderCell={(rowData, columnKey) => RenderCell({ rowData, columnKey })}
        />
      </div>
    </div>
  );
};
