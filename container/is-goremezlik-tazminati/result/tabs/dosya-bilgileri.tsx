"use client";
import React from "react";
import { TableWrapper } from "@/components/table/table";

interface DosyaBilgileriType {
  [key: string]: string;
  label: string;
  value: string;
}

export const DosyaBilgileri = () => {
  const columns = [
    { uid: "label", name: "Bilgi" },
    { uid: "value", name: "Değer" }
  ];

  const data = [
    { label: "Adı Soyadı", value: "Ali Veli" },
    { label: "Dosya No", value: "55667788-01" },
    { label: "Mahkeme", value: "Asliye Hukuk Mahkemesi" },
    { label: "Olay", value: "Trafik Kazası" },
    { label: "Olay Tarihi", value: "08.09.2024" },
    { label: "Muayene Tarihi", value: "10.09.2024" },
    { label: "Rapor Tarihi", value: "24.11.2024" },
    { label: "T.C. Kimlik No", value: "11111111111" },
    { label: "Doğum Tarihi", value: "05.07.1997 (27 yıl 4 ay 20 gün)" },
    { label: "Cinsiyeti", value: "Erkek" },
    { label: "Medeni Hali", value: "Bekar" },
    { label: "Askerlik Durumu", value: "Terhis" },
    { label: "Aylık Net Geliri", value: "16907.09 (Asgari Ücret)" },
    { label: "SGK Peşin Sermaye Değeri", value: "0.00" },
    { label: "Kusur Oranı", value: "%45" },
    { label: "Maluliyet Oranı", value: "Bekleniyor..." },
    { label: "Hatır Taşıması İndirimi", value: "YOK" },
    { label: "Müterafik Kusur İndirimi", value: "YOK" }
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <TableWrapper<DosyaBilgileriType>
        columns={columns}
        data={data}
      />
    </div>
  );
}; 