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
import { useFetch } from "@/hooks/use-fetch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from "date-fns";
import { formatDateToUTC } from "@/utils/formatDate";

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
  Claimant: Yup.object().shape({
    Name: Yup.string().required('Ad zorunludur'),
    Surname: Yup.string().required('Soyad zorunludur'),
    BirthDate: Yup.date().required('Doğum tarihi zorunludur'),
    TCKN: Yup.string()
      .required('TCKN zorunludur')
      .matches(/^[0-9]{11}$/, 'TCKN 11 haneli olmalıdır'),
    Gender: Yup.string().required('Cinsiyet seçimi zorunludur'),
    MaritalStatus: Yup.string().required('Medeni hal seçimi zorunludur'),
    MilitaryStatus: Yup.string().required('Askerlik durumu seçimi zorunludur'),
    FatherName: Yup.string().required('Baba adı zorunludur'),
    EmploymentStatus: Yup.string().required('Çalışma durumu seçimi zorunludur'),
    MonthlyIncome: Yup.number()
      .required('Aylık gelir zorunludur')
      .min(0, 'Gelir 0\'dan küçük olamaz'),
    IsMinimumWage: Yup.boolean(),
  }),
});


// Validation şeması
const validationSchema2 = Yup.object().shape({
  Event: Yup.object().shape({
    EventType: Yup.string().required('Olay türü seçimi zorunludur'),
    EventDate: Yup.date().required('Olay tarihi zorunludur'),
    ExaminationDate: Yup.date()
      .required('Muayene tarihi zorunludur')
      .min(Yup.ref('EventDate'), 'Muayene tarihi olay tarihinden önce olamaz'),
    LifeStatus: Yup.string().required('Durum seçimi zorunludur'),

    FaultRate: Yup.number()
      .required('Kusur oranı zorunludur')
      .min(0, 'Kusur oranı 0\'dan küçük olamaz')
      .max(100, 'Kusur oranı 100\'den büyük olamaz'),
    DisabilityRate: Yup.number()
      .required('Maluliyet oranı zorunludur')
      .min(0, 'Maluliyet oranı 0\'dan küçük olamaz')
      .max(100, 'Maluliyet oranı 100\'den büyük olamaz'),
    SgkAdvanceCapital: Yup.number()
      .required('SGK peşin sermaye değeri zorunludur')
      .min(0, 'SGK peşin sermaye değeri 0\'dan küçük olamaz'),
    LifeTable: Yup.string().required('Yaşam tablosu seçimi zorunludur'),
    IsFavorTransportDiscount: Yup.boolean(),
    IsMutualFaultDiscount: Yup.boolean(),
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
      name: 'Claimant.Name',
      label: 'Adı',
      type: 'text' as const,
      required: true,
      placeholder: 'Adınızı giriniz',
    },
    {
      name: 'Claimant.Surname',
      label: 'Soyadı',
      type: 'text' as const,
      required: true,
      placeholder: 'Soyadınızı giriniz',
    },
    {
      name: 'Claimant.BirthDate',
      label: 'Doğum Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'Claimant.TCKN',
      label: 'TCKN',
      type: 'text' as const,
      required: true,
      placeholder: 'TC Kimlik Numaranızı giriniz',
      maxLength: 11,
    },
    {
      name: 'Claimant.Gender',
      label: 'Cinsiyeti',
      type: 'select' as const,
      required: true,
      options: genders?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Claimant.MaritalStatus',
      label: 'Medeni Hali',
      type: 'select' as const,
      required: true,
      options: maritalStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Claimant.MilitaryStatus',
      label: 'Askerlik Durumu',
      disabled: form1Ref.current?.values.Claimant?.Gender === 'female',
      type: 'select' as const,
      required: true,
      options: militaryStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Claimant.FatherName',
      label: 'Baba Adı',
      type: 'text' as const,
      required: true,
      placeholder: 'Baba adını giriniz',
    },
    {
      name: 'Claimant.EmploymentStatus',
      label: 'Çalışma Durumu',
      type: 'select' as const,
      required: true,
      options: employmentStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Claimant.MonthlyIncome',
      label: 'Aylık Net Gelir',
      type: 'number' as const,
      required: true,
      placeholder: '0',
    },
    {
      name: 'Claimant.IsMinimumWage',
      label: 'Asgari Ücret Tarifesi',
      type: 'switch' as const,
    },
  ];

  const eventFields = [
    {
      name: 'Event.EventType',
      label: 'Olay Türü',
      type: 'select' as const,
      required: true,
      options: eventTypes?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Event.EventDate',
      label: 'Olay Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'Event.ExaminationDate',
      label: 'Muayene Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'Event.LifeStatus',
      label: 'Durum',
      type: 'select' as const,
      required: true,
      options: lifeStatus?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Event.Court',
      label: 'Mahkeme',
      type: 'select' as const,
      required: true,
      options: courts?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Event.FaultRate',
      label: 'Kusur Oranı',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      endContent: '%',
    },
    {
      name: 'Event.DisabilityRate',
      label: 'Maluliyet Oranı',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      endContent: '%',
    },
    {
      name: 'Event.SgkAdvanceCapital',
      label: 'SGK Peşin Sermaye Değeri',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
      endContent: '₺',
    },
    {
      name: 'Event.LifeTable',
      label: 'Yaşam Tablosu',
      type: 'select' as const,
      required: true,
      options: lifeTables?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Event.IsFavorTransportDiscount',
      label: 'Hatır Taşıması İndirimi',
      type: 'switch' as const,
      col: 6,
    },
    {
      name: 'Event.IsMutualFaultDiscount',
      label: 'Müterafik Kusur İndirimi',
      type: 'switch' as const,
      col: 6,
    },
  ];

  const fields3 = [
    {
      name: 'PredefinedNote',
      label: 'Hazır Notlar',
      type: 'select' as const,
      options: predefinedNotes?.[0]?.values.map((item) => ({ label: item.name, value: item.value }))
    },
    {
      name: 'Note',
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
        const claimantData = {
          ...form1Ref.current?.values.Claimant,
          BirthDate: format(new Date(form1Ref.current?.values.Claimant.BirthDate), 'yyyy-MM-dd')
        };

        const eventData = {
          ...form2Ref.current?.values.Event,
          EventDate: formatDateToUTC(form2Ref.current?.values.Event.EventDate),
          ExaminationDate: formatDateToUTC(form2Ref.current?.values.Event.ExaminationDate)
        };

        const formData = new FormData();

        // Ana form verileri
        formData.append('PredefinedNote', form3Ref.current?.values.PredefinedNote);
        formData.append('Note', form3Ref.current?.values.Note);

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
              Claimant: {
                Name: '',
                Surname: '',
                BirthDate: '',
                TCKN: '',
                Gender: '',
                MaritalStatus: '',
                MilitaryStatus: '',
                FatherName: '',
                EmploymentStatus: '',
                MonthlyIncome: 0,
                IsMinimumWage: false,
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
              Event: {
                EventType: '',
                EventDate: '',
                ExaminationDate: '',
                Status: '',
                Court: 1,
                FaultRate: 0,
                DisabilityRate: 0,
                SgkCapitalValue: 0,
                LifeTable: '',
                IsFavorTransportDiscount: false,
                IsMutualFaultDiscount: false,
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
              PredefinedNote: '',
              Note: '',
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
