/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import React, { useRef } from "react";
import { Button } from "@heroui/react";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";
import { TableWrapper } from "@/components/table/table";

const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 5mm;
    }
    
    .print-content {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    .print-content > div {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
    }

    .print-content .shadow-small {
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        background-color: transparent !important;
     }

    .print-content h4 {
      font-size: 14pt !important;
      margin: 15px 0 10px 0 !important;
      color: #000 !important;
    }

    .print-content [role="table"] {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .print-content [role="table"] > div {
      padding: 0 !important;
      margin: 0 !important;
    }

    .no-print {
      display: none !important;
    }

    button {
      display: none !important;
    }
  }
`;

export const HesaplamaBilgileri = ({ detail }: { detail: any }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: printStyles,
  });

  // Aktif/Pasif Dönem Özeti için tablo yapısı
  const donemColumns = [
    { uid: "label", name: "//" },
    { uid: "kazaTarihi", name: "Kaza Tarihi" },
    { uid: "raporTarihi", name: "Rapor Tarihi" },
    { uid: "emeklilikTarihi", name: "Emeklilik Tarihi" },
    { uid: "destekSonuTarihi", name: "Destek Sonu Tarihi" },
  ];

  // Helper function to format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("tr-TR");
    } catch {
      return dateString;
    }
  };

  // Helper function to format age object
  const formatAge = (
    ageObj: { year?: number; month?: number; day?: number } | null | undefined
  ) => {
    if (!ageObj) return "-";
    const { year = 0, month = 0, day = 0 } = ageObj;
    return `${year} yıl ${month} ay ${day} gün`;
  };

  // Get calculation data
  const calc = detail?.calculation;
  const summary = calc?.activePassivePeriodSummary;

  const donemData = [
    {
      id: 'donem-1',
      label: "Tarih",
      kazaTarihi: formatDate(summary?.eventDate),
      raporTarihi: formatDate(summary?.reportDate),
      emeklilikTarihi: formatDate(summary?.retirementDate),
      destekSonuTarihi: formatDate(summary?.supportEndDate),
    },
    {
      id: 'donem-2',
      label: "Yaş",
      kazaTarihi: formatAge(summary?.eventDateAge),
      raporTarihi: formatAge(summary?.reportDateAge),
      emeklilikTarihi: formatAge(summary?.retirementDateAge),
      destekSonuTarihi: formatAge(summary?.supportEndDateAge),
    },
    {
      id: 'donem-3',
      label: "Dönem Süresi",
      kazaTarihi: "-",
      raporTarihi: formatAge(summary?.reportPeriod),
      emeklilikTarihi: formatAge(summary?.retirementPeriod),
      destekSonuTarihi: formatAge(summary?.supportEndPeriod),
    },
  ];

  // Tazminat tabloları için ortak sütun yapısı
  const tazminatColumns = [
    { uid: "tutar", name: "Tutar" },
    { uid: "bilinenDonem", name: "Bilinen Dönem" },
    { uid: "aktifDonem", name: "Aktif Dönem" },
    { uid: "pasifDonem", name: "Pasif Dönem" },
    { uid: "toplam", name: "Toplam" },
  ];

  // Helper function to format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "Hesaplanmadı";
    return `${amount.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ₺`;
  };

  // Tazminat tabloları için veri yapısı - gerçek verilerle doldurulacak
  const getCompensationData = (
    compensationType:
      | "temporaryDisability"
      | "permanentDisability"
      | "temporaryCaregiverDisability"
      | "permanentCaregiverDisability"
      | "totalDisability"
  ) => {
    const compensation = calc?.[compensationType];

    return [
      {
        id: `${compensationType}-row`,
        tutar: "Tutar",
        bilinenDonem: formatCurrency(compensation?.knownPeriodAmount),
        aktifDonem: formatCurrency(compensation?.activePeriodAmount),
        pasifDonem: formatCurrency(compensation?.passivePeriodAmount),
        toplam: formatCurrency(compensation?.totalAmount),
      },
    ];
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end no-print">
        <Button
          color="primary"
          size="sm"
          startContent={<PrinterIcon size={18} />}
          onPress={() => handlePrint()}
        >
          PDF Olarak Yazdır
        </Button>
      </div>

      <div ref={componentRef} className="print-content w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full">
            {/* Aktif/Pasif Dönem Özeti */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-semibold">Aktif/Pasif Dönem Özeti</h4>
              <TableWrapper columns={donemColumns} data={donemData} />
              <p className="text-sm italic">
                *TRH 2010 Yaşam Tablosu kullanılarak hesaplanmıştır.
              </p>
            </div>

            {/* Geçici İşgöremezlik Tazminatı */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-lg mt-4 font-semibold">
                  Geçici İşgöremezlik Tazminatı
                  {detail?.compensation?.temporaryDisabilityDay &&
                    ` (${detail.compensation.temporaryDisabilityDay} Gün)`}
                </h4>
                <Button color="primary" size="sm" className="no-print">
                  Detay
                </Button>
              </div>
              <TableWrapper
                columns={tazminatColumns}
                data={getCompensationData("temporaryDisability")}
              />
            </div>

            {/* Sürekli İşgöremezlik Tazminatı */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">
                Sürekli İşgöremezlik Tazminatı
              </h4>
              <TableWrapper
                columns={tazminatColumns}
                data={getCompensationData("permanentDisability")}
              />
            </div>

            {/* Geçici Bakıcı Tazminatı */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">
                Geçici Bakıcı Tazminatı
              </h4>
              <TableWrapper
                columns={tazminatColumns}
                data={getCompensationData("temporaryCaregiverDisability")}
              />
            </div>

            {/* Sürekli Bakıcı Tazminatı */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">
                Sürekli Bakıcı Tazminatı
              </h4>
              <TableWrapper
                columns={tazminatColumns}
                data={getCompensationData("permanentCaregiverDisability")}
              />
            </div>

            {/* Sonuç */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">Sonuç</h4>
              <TableWrapper
                columns={tazminatColumns}
                data={getCompensationData("totalDisability")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
