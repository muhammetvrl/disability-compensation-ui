"use client";
import React from "react";
import { TableWrapper } from "@/components/table/table";

interface DosyaBilgileriType {
  id: string;
  [key: string]: string;
  label: string;
  value: string;
}

export const DosyaBilgileri = ({ detail }: { detail: any }) => {
  const columns = [
    { uid: "label", name: "Bilgi" },
    { uid: "value", name: "Değer" }
  ];

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR');
    } catch {
      return dateString;
    }
  };

  // Get compensation data
  const compensation = detail?.compensation;
  const claimant = compensation?.claimant;
  const event = compensation?.event;

  const data = [
    { id: '1', label: "Adı Soyadı", value: `${claimant?.name || ''} ${claimant?.surname || ''}`.trim() || '-' },
    { id: '2', label: "T.C. Kimlik No", value: claimant?.tckn || '-' },
    { id: '3', label: "Doğum Tarihi", value: formatDate(claimant?.birthDate) },
    { id: '4', label: "Cinsiyeti", value: claimant?.gender || '-' },
    { id: '5', label: "Medeni Hali", value: claimant?.maritalStatus || '-' },
    { id: '6', label: "Askerlik Durumu", value: claimant?.militaryStatus || '-' },
    { id: '7', label: "Baba Adı", value: claimant?.fatherName || '-' },
    { id: '8', label: "Çalışma Durumu", value: claimant?.employmentStatus || '-' },
    { id: '9', label: "Aylık Net Geliri", value: claimant?.monthlyIncome ? `${claimant.monthlyIncome.toLocaleString('tr-TR')} ₺` : '-' },
    { id: '10', label: "Asgari Ücret", value: claimant?.isMinimumWage ? "Evet" : "Hayır" },
    { id: '11', label: "Olay Türü", value: event?.eventType || '-' },
    { id: '12', label: "Olay Tarihi", value: formatDate(event?.eventDate) },
    { id: '13', label: "Muayene Tarihi", value: formatDate(event?.examinationDate) },
    { id: '14', label: "Durum", value: event?.lifeStatus || '-' },
    { id: '15', label: "Mahkeme", value: event?.court || '-' },
    { id: '16', label: "Kusur Oranı", value: event?.faultRate ? `${(event.faultRate * 100).toFixed(2)}%` : '-' },
    { id: '17', label: "Maluliyet Oranı", value: event?.disabilityRate ? `${(event.disabilityRate * 100).toFixed(2)}%` : '-' },
    { id: '18', label: "SGK Peşin Sermaye Değeri", value: event?.sgkAdvanceCapital ? `${event.sgkAdvanceCapital.toLocaleString('tr-TR')} ₺` : '-' },
    { id: '19', label: "Yaşam Tablosu", value: event?.lifeTable || '-' },
    { id: '20', label: "Hatır Taşıması İndirimi", value: event?.isFavorTransportDiscount ? "Var" : "Yok" },
    { id: '21', label: "Müterafik Kusur İndirimi", value: event?.isMutualFaultDiscount ? "Var" : "Yok" },
    { id: '22', label: "Geçici Engel", value: compensation?.hasTemporaryDisability ? "Var" : "Yok" },
    { id: '23', label: "Geçici Engel Günü", value: compensation?.temporaryDisabilityDay || '-' },
    { id: '24', label: "Bakıcı", value: compensation?.hasCaregiver ? "Var" : "Yok" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <TableWrapper<DosyaBilgileriType>
        columns={columns}
        data={data}
        rowKey="id"
      />
    </div>
  );
}; 