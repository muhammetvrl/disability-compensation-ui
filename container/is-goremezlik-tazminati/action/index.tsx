"use client";
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import Panel from "@/components/panel/panel";
import * as Yup from 'yup';
import { Form } from "@/components/form/form";
import { FormikProps } from 'formik';
import { DocumentUploadSidebar } from "../document-upload-sidebar";
import { NonInvoicedExpenseDrawer } from "../non-invoiced-expense-drawer";
import { useRouter } from "next/navigation";
import { compensationService, ICompensationRequest, IDocument } from "@/services/compensations";
import { CalendarDate } from '@internationalized/date';
import { useFetch } from "@/hooks/use-fetch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IParameterValue {
  name: string;
  value: string;
}

interface IParameter {
  code: string;
  values: IParameterValue[];
}

export interface Expense {
  expenseType: string;
  referenceNo: string;
  date: string;
  amount: number;
  file: string;
}

export interface Document {
  documentType: string;
  referenceNo: string;
  date: string;
  file: string;
}

const validationSchema = Yup.object().shape({
  claimant: Yup.object().shape({
    name: Yup.string().required('Ad zorunludur'),
    surname: Yup.string().required('Soyad zorunludur'),
    birthDate: Yup.date().required('Doğum tarihi zorunludur'),
    tckn: Yup.string()
      .required('TCKN zorunludur')
      .matches(/^[0-9]{11}$/, 'TCKN 11 haneli olmalıdır'),
    gender: Yup.string().required('Cinsiyet seçimi zorunludur'),
    maritalStatus: Yup.string().required('Medeni hal seçimi zorunludur'),
    militaryStatus: Yup.string().required('Askerlik durumu seçimi zorunludur'),
    fatherName: Yup.string().required('Baba adı zorunludur'),
    employmentStatus: Yup.string().required('Çalışma durumu seçimi zorunludur'),
    monthlyIncome: Yup.number()
      .required('Aylık gelir zorunludur')
      .min(0, 'Gelir 0\'dan küçük olamaz'),
    isMinimumWage: Yup.boolean(),
  }),
});


// Validation şeması
const validationSchema2 = Yup.object().shape({
  event: Yup.object().shape({
    eventType: Yup.string().required('Olay türü seçimi zorunludur'),
    eventDate: Yup.date().required('Olay tarihi zorunludur'),
    examinationDate: Yup.date()
      .required('Muayene tarihi zorunludur')
      .min(Yup.ref('eventDate'), 'Muayene tarihi olay tarihinden önce olamaz'),
    lifeStatus: Yup.string().required('Durum seçimi zorunludur'),
    court: Yup.string().required('Mahkeme seçimi zorunludur'),
    faultRate: Yup.number()
      .required('Kusur oranı zorunludur')
      .min(0, 'Kusur oranı 0\'dan küçük olamaz')
      .max(100, 'Kusur oranı 100\'den büyük olamaz'),
    disabilityRate: Yup.number()
      .required('Maluliyet oranı zorunludur')
      .min(0, 'Maluliyet oranı 0\'dan küçük olamaz')
      .max(100, 'Maluliyet oranı 100\'den büyük olamaz'),
    sgkAdvanceCapital: Yup.number()
      .required('SGK peşin sermaye değeri zorunludur')
      .min(0, 'SGK peşin sermaye değeri 0\'dan küçük olamaz'),
    lifeTable: Yup.string().required('Yaşam tablosu seçimi zorunludur'),
    isFavorTransportDiscount: Yup.boolean(),
    isMutualFaultDiscount: Yup.boolean(),
  }),
});


// Validation şeması
const validationSchema3 = Yup.object().shape({
  predefinedNote: Yup.string(),
  note: Yup.string(),
});

export const IncapacityCompensationNew = () => {
  const router = useRouter();
  const form1Ref = useRef<FormikProps<any>>(null);
  const form2Ref = useRef<FormikProps<any>>(null);
  const form3Ref = useRef<FormikProps<any>>(null);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [isNonInvoicedExpenseOpen, setIsNonInvoicedExpenseOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  console.log("🚀 ~ IncapacityCompensationNew ~ expenses:", expenses)

  const { data: genders } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['gender']
    }
  });

  const { data: maritalStatus } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['marital_status']
    }
  });

  const { data: eventTypes } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['event_type']
    }
  });

  const { data: militaryStatus } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['military_status']
    }
  });

  const { data: employmentStatus } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['employment_status']
    }
  });

  const { data: lifeStatus } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['life_status']
    }
  });

  const { data: courts } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['court']
    }
  });

  const { data: lifeTables } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['life_table']
    }
  });

  const { data: predefinedNotes } = useFetch<IParameter[]>('/parameters/search', {
    method: 'POST',
    data: {
      codes: ['predefined_notes']
    }
  });

  const fields = [
    {
      name: 'claimant.name',
      label: 'Adı',
      type: 'text' as const,
      required: true,
      placeholder: 'Adınızı giriniz',
    },
    {
      name: 'claimant.surname',
      label: 'Soyadı',
      type: 'text' as const,
      required: true,
      placeholder: 'Soyadınızı giriniz',
    },
    {
      name: 'claimant.birthDate',
      label: 'Doğum Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'claimant.tckn',
      label: 'TCKN',
      type: 'text' as const,
      required: true,
      placeholder: 'TC Kimlik Numaranızı giriniz',
      maxLength: 11,
    },
    {
      name: 'claimant.gender',
      label: 'Cinsiyeti',
      type: 'select' as const,
      required: true,
      options: genders?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'claimant.maritalStatus',
      label: 'Medeni Hali',
      type: 'select' as const,
      required: true,
      options: maritalStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'claimant.militaryStatus',
      label: 'Askerlik Durumu',
      disabled: form1Ref.current?.values.claimant.gender === 'female',
      type: 'select' as const,
      required: true,
      options: militaryStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'claimant.fatherName',
      label: 'Baba Adı',
      type: 'text' as const,
      required: true,
      placeholder: 'Baba adını giriniz',
    },
    {
      name: 'claimant.employmentStatus',
      label: 'Çalışma Durumu',
      type: 'select' as const,
      required: true,
      options: employmentStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'claimant.monthlyIncome',
      label: 'Aylık Net Gelir',
      type: 'number' as const,
      required: true,
      placeholder: '0',
    },
    {
      name: 'claimant.isMinimumWage',
      label: 'Asgari Ücret Tarifesi',
      type: 'switch' as const,
    },
  ];

  const eventFields = [
    {
      name: 'event.eventType',
      label: 'Olay Türü',
      type: 'select' as const,
      required: true,
      options: eventTypes?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'event.eventDate',
      label: 'Olay Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'event.examinationDate',
      label: 'Muayene Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'event.lifeStatus',
      label: 'Durum',
      type: 'select' as const,
      required: true,
      options: lifeStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'event.court',
      label: 'Mahkeme',
      type: 'select' as const,
      required: true,
      options: courts?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'event.faultRate',
      label: 'Kusur Oranı',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      endContent: '%',
    },
    {
      name: 'event.disabilityRate',
      label: 'Maluliyet Oranı',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      endContent: '%',
    },
    {
      name: 'event.sgkAdvanceCapital',
      label: 'SGK Peşin Sermaye Değeri',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      endContent: '₺',
    },
    {
      name: 'event.lifeTable',
      label: 'Yaşam Tablosu',
      type: 'select' as const,
      required: true,
      options: lifeTables?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'event.isFavorTransportDiscount',
      label: 'Hatır Taşıması İndirimi',
      type: 'switch' as const,
      col: 6,
    },
    {
      name: 'event.isMutualFaultDiscount',
      label: 'Müterafik Kusur İndirimi',
      type: 'switch' as const,
      col: 6,
    },
  ];

  const fields3 = [
    {
      name: 'predefinedNote',
      label: 'Hazır Notlar',
      type: 'select' as const,
      options: predefinedNotes?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'note',
      label: 'Notlar',
      type: 'textarea' as const,
      placeholder: 'Notlarınızı buraya yazınız...',
      rows: 4,
    },
  ];

  const handleSubmit = async () => {
    try {
      await Promise.all([
        form1Ref.current?.submitForm(),
        form2Ref.current?.submitForm(),
        form3Ref.current?.submitForm()
      ]);

      const isForm1Valid = await form1Ref.current?.validateForm();
      const isForm2Valid = await form2Ref.current?.validateForm();
      const isForm3Valid = await form3Ref.current?.validateForm();

      if (
        Object.keys(isForm1Valid || {}).length === 0 &&
        Object.keys(isForm2Valid || {}).length === 0 &&
        Object.keys(isForm3Valid || {}).length === 0
      ) {
        const formatDateToUTC = (date: string) => {
          const localDate = new Date(date);
          return new Date(
            Date.UTC(
              localDate.getFullYear(),
              localDate.getMonth(),
              localDate.getDate(),
              0, 0, 0
            )
          ).toISOString();
        };

        const claimantData = {
          ...form1Ref.current?.values.claimant,
          birthDate: formatDateToUTC(form1Ref.current?.values.claimant.birthDate)
        };

        const eventData = {
          ...form2Ref.current?.values.event,
          eventDate: formatDateToUTC(form2Ref.current?.values.event.eventDate),
          examinationDate: formatDateToUTC(form2Ref.current?.values.event.examinationDate)
        };

        const formData = new FormData();
        
        // Ana form verileri
        formData.append('PredefinedNote', form3Ref.current?.values.predefinedNote);
        formData.append('Note', form3Ref.current?.values.note);
        
        // Claimant verileri
        Object.entries(claimantData).forEach(([key, value]: [string, any]) => {
          formData.append(`Claimant.${key}`, value.toString());
        });

        // Event verileri
        Object.entries(eventData).forEach(([key, value]: [string, any]) => {
          formData.append(`Event.${key}`, value.toString());
        });

        // Expenses array'i için
        expenses.forEach((expense, index) => {
          formData.append(`Expenses[${index}].ExpenseType`, expense.expenseType);
          formData.append(`Expenses[${index}].ReferenceNo`, expense.referenceNo);
          formData.append(`Expenses[${index}].Date`, expense.date);
          formData.append(`Expenses[${index}].Amount`, expense.amount.toString());
          formData.append(`Expenses[${index}].File`, expense.file);
        });

        // Documents array'i için
        documents.forEach((document, index) => {
          formData.append(`Documents[${index}].DocumentType`, document.documentType);
          formData.append(`Documents[${index}].ReferenceNo`, document.referenceNo);
          formData.append(`Documents[${index}].Date`, document.date);
          formData.append(`Documents[${index}].File`, document.file);
        });

        try {
          const result = await compensationService.create(formData as any);

          if (result.data) {
            router.push(`/is-goremezlik-tazminati/sonuc/${result.data}`);
          } else {
            // Hata mesajlarını detaylı bir şekilde göster
            if (result.ValidationErrors) {
              result.ValidationErrors.forEach((error: any) => {
                toast.error(`${error.PropertyMessage}: ${error.ErrorMessage}`);
              });
            } else {
              toast.error(result.Message);
            }
          }
        } catch (error) {
          console.error('Hata oluştu:', error);
          toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs radius={"sm"} variant="solid">
        <BreadcrumbItem>Anasayfa</BreadcrumbItem>
        <BreadcrumbItem>İş Göremezlik Tazminatı</BreadcrumbItem>
        <BreadcrumbItem>Yeni Tazminat Hesabı</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold">Yeni Tazminat Hesabı</h3>

      <div className="flex flex-col gap-4">
        <Panel title="Hak Sahibi Bilgileri">
          <Form
            formRef={form1Ref}
            initialValues={{
              claimant: {
                 firstName: '',
              lastName: '',
              birthDate: '',
              tckn: '',
              gender: '',
              maritalStatus: '',
              militaryStatus: '',
              fatherName: '',
              employmentStatus: '',
              monthlyIncome: 0,
              isMinimumWage: false,
              }
            }}
            fields={fields}
            validationSchema={validationSchema}
            hideSubmitButton
          />
        </Panel>

        <Panel title="Olay Bilgileri">
          <Form
            formRef={form2Ref}
            initialValues={{
              event: {
                eventType: '',
                eventDate: '',
                examinationDate: '',
                status: '',
                court: '',
                faultRate: 0,
                disabilityRate: 0,
                sgkCapitalValue: 0,
                lifeTable: '',
                hasHatirTasimasi: false,
                hasMuterafikKusur: false,
              }
            }}
            fields={eventFields}
            validationSchema={validationSchema2}
            hideSubmitButton
          />
        </Panel>

        <Panel title="Rapor Notları">
          <Form
            formRef={form3Ref}
            initialValues={{
              predefinedNote: 'note1',
              note: 'Bu bir örnek nottur.',
            }}
            fields={fields3}
            validationSchema={validationSchema3}
            hideSubmitButton
          />
        </Panel>
      </div>

      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Button
            color="primary"
            onPress={() => setIsDocumentUploadOpen(true)}
            className="w-full md:w-auto"
          >
            Evrak Ekle
          </Button>
          <Button
            color="primary"
            onPress={() => setIsNonInvoicedExpenseOpen(true)}
            className="w-full md:w-auto"
          >
            Fatura Edilemeyen Gider Ekle
          </Button>
        </div>
        <Button color="success" onPress={handleSubmit} className="w-full md:w-auto">Hesapla</Button>
      </div>

      <DocumentUploadSidebar
        isOpen={isDocumentUploadOpen}
        onClose={() => setIsDocumentUploadOpen(false)}
        documents={documents}
        setDocuments={setDocuments}
      />

      <NonInvoicedExpenseDrawer
        isOpen={isNonInvoicedExpenseOpen}
        onClose={() => setIsNonInvoicedExpenseOpen(false)}
        expenses={expenses}
        setExpenses={setExpenses}
      />

      <ToastContainer />
    </div>
  );
};
