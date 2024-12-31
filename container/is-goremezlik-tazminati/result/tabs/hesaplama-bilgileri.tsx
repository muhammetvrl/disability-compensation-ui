/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import React, { useRef } from "react";
import { Button } from "@nextui-org/react";
import { useReactToPrint } from 'react-to-print';
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

export const HesaplamaBilgileri = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: printStyles
  });

  // Aktif/Pasif Dönem Özeti için tablo yapısı
  const donemColumns = [
    { uid: "label", name: "//" },
    { uid: "kazaTarihi", name: "Kaza Tarihi" },
    { uid: "raporTarihi", name: "Rapor Tarihi" },
    { uid: "emeklilikTarihi", name: "Emeklilik Tarihi" },
    { uid: "destekSonuTarihi", name: "Destek Sonu Tarihi" }
  ];

  const donemData = [
    { label: "//", kazaTarihi: "08.09.2024", raporTarihi: "24.11.2024", emeklilikTarihi: "05.07.2057", destekSonuTarihi: "05.07.2067" },
    { label: "Yaş", kazaTarihi: "27 yıl 2 ay 3 gün", raporTarihi: "27 yıl 4 ay 26 gün", emeklilikTarihi: "60 yıl", destekSonuTarihi: "70 yıl" },
    { label: "Dönem Süresi", kazaTarihi: "-", raporTarihi: "2 ay 16 gün", emeklilikTarihi: "32 yıl 7 ay 11 gün", destekSonuTarihi: "10 yıl" }
  ];

  // Tazminat tabloları için ortak sütun yapısı
  const tazminatColumns = [
    { uid: "tutar", name: "Tutar" },
    { uid: "bilinenDonem", name: "Bilinen Dönem" },
    { uid: "aktifDonem", name: "Aktif Dönem" },
    { uid: "pasifDonem", name: "Pasif Dönem" },
    { uid: "toplam", name: "Toplam" }
  ];

  // Tazminat tabloları için ortak veri yapısı
  const tazminatData = [
    { tutar: "Tutar", bilinenDonem: "Bekleniyor ₺", aktifDonem: "Bekleniyor ₺", pasifDonem: "Bekleniyor ₺", toplam: "Bekleniyor ₺" }
  ];

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
              <TableWrapper 
                columns={donemColumns}
                data={donemData}
              />
              <p className="text-sm italic">*TRH 2010 Yaşam Tablosu kullanılarak hesaplanmıştır.</p>
            </div>

            {/* Geçici İşgöremezlik Tazminatı */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-lg mt-4 font-semibold">Geçici İşgöremezlik Tazminatı (8 Ay)</h4>
                <Button color="primary" size="sm">Detay</Button>
              </div>
              <TableWrapper 
                columns={tazminatColumns}
                data={tazminatData}
              />
            </div>

            {/* Sürekli İşgöremezlik Tazminatı */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">Sürekli İşgöremezlik Tazminatı</h4>
              <TableWrapper 
                columns={tazminatColumns}
                data={tazminatData}
              />
            </div>

            {/* Geçici Bakıcı Tazminatı */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">Geçici Bakıcı Tazminatı</h4>
              <TableWrapper 
                columns={tazminatColumns}
                data={tazminatData}
              />
            </div>

            {/* Sürekli Bakıcı Tazminatı */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">Sürekli Bakıcı Tazminatı</h4>
              <TableWrapper 
                columns={tazminatColumns}
                data={tazminatData}
              />
            </div>

            {/* Sonuç */}
            <div className="flex flex-col gap-2">
              <h4 className="text-lg mt-4 font-semibold">Sonuç</h4>
              <TableWrapper 
                columns={tazminatColumns}
                data={tazminatData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 