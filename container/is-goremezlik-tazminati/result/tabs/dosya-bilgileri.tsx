"use client";
import React from "react";
import { TableWrapper } from "@/components/table/table";

interface DosyaBilgileriType {
  [key: string]: string;
  label: string;
  value: string;
}

export const DosyaBilgileri = ({ detail }: { detail: any }) => {
  const columns = [
    { uid: "label", name: "Bilgi" },
    { uid: "value", name: "Değer" }
  ];

  const data = [
    { label: "Adı Soyadı", value: `${detail?.claimant?.name} ${detail?.claimant?.surname}` },
    { label: "T.C. Kimlik No", value: detail?.claimant?.tckn },
    { label: "Doğum Tarihi", value: detail?.claimant?.birthDate.split("T")[0] },
    { label: "Cinsiyeti", value: detail?.claimant?.gender === "male" ? "Erkek" : "Kadın" },
    { label: "Medeni Hali", value: detail?.claimant?.maritalStatus === "single" ? "Bekar" : "Evli" },
    { label: "Askerlik Durumu", value: detail?.claimant?.militaryStatus === "completed" ? "Terhis" : "Yapılmadı" },
    { label: "Aylık Net Geliri", value: `${detail?.claimant?.monthlyIncome} (Asgari Ücret: ${detail?.claimant?.isMinimumWage ? "Evet" : "Hayır"})` },
    { label: "Kusur Oranı", value: `${detail?.event?.faultRate}%` },
    { label: "Maluliyet Oranı", value: `${detail?.event?.disabilityRate ?? 0}%` },
    { label: "SGK Peşin Sermaye Değeri", value: detail?.event?.sgkAdvanceCapital?.toString() },
    { label: "Olay", value: detail?.event?.eventType === "workAccident" ? "İş Kazası" : "Diğer" },
    { label: "Olay Tarihi", value: detail?.event?.eventDate.split("T")[0] },
    { label: "Muayene Tarihi", value: detail?.event?.examinationDate.split("T")[0] },
    { label: "Mahkeme", value: detail?.event?.court === "laborCourt" ? "İş Mahkemesi" : "Diğer" },
    { label: "Hatır Taşıması İndirimi", value: detail?.event?.isFavorTransportDiscount ? "Var" : "Yok" },
    { label: "Müterafik Kusur İndirimi", value: detail?.event?.isMutualFaultDiscount ? "Var" : "Yok" },
    { label: "Olay Durumu", value: detail?.event?.lifeStatus === "ongoing" ? "Devam Ediyor" : "Tamamlandı" },
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