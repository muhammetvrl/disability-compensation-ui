"use client";
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import Panel from "@/components/panel/panel";
import * as Yup from 'yup';
import { Form } from "@/components/form/form";
import { FormikProps } from 'formik';
import { DocumentUploadSidebar } from '@/components/document-upload-sidebar';
import { NonInvoicedExpenseDrawer } from '@/components/non-invoiced-expense-drawer';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Ad zorunludur'),
  lastName: Yup.string().required('Soyad zorunludur'),
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
});

const fields2 = [
  {
    name: 'eventType',
    label: 'Olay Türü',
    type: 'select' as const,
    required: true,
    options: [
      { label: 'İş Kazası', value: 'workAccident' },
      { label: 'Meslek Hastalığı', value: 'occupationalDisease' },
      { label: 'Trafik Kazası', value: 'trafficAccident' },
    ],
  },
  {
    name: 'eventDate',
    label: 'Olay Tarihi',
    type: 'date' as const,
    required: true,
  },
  {
    name: 'examinationDate',
    label: 'Muayene Tarihi',
    type: 'date' as const,
    required: true,
  },
  {
    name: 'status',
    label: 'Durum',
    type: 'select' as const,
    required: true,
    options: [
      { label: 'Devam Ediyor', value: 'ongoing' },
      { label: 'Sonuçlandı', value: 'completed' },
    ],
  },
  {
    name: 'court',
    label: 'Mahkeme',
    type: 'select' as const,
    required: true,
    options: [
      { label: 'İş Mahkemesi', value: 'laborCourt' },
      { label: 'Asliye Hukuk Mahkemesi', value: 'civilCourt' },
    ],
  },
  {
    name: 'faultRate',
    label: 'Kusur Oranı',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    endContent: '%',
  },
  {
    name: 'disabilityRate',
    label: 'Maluliyet Oranı',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    endContent: '%',
  },
  {
    name: 'sgkCapitalValue',
    label: 'SGK Peşin Sermaye Değeri',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    endContent: '₺',
  },
  {
    name: 'lifeTable',
    label: 'Yaşam Tablosu',
    type: 'select' as const,
    required: true,
    options: [
      { label: 'PMF 1931', value: 'PMF1931' },
      { label: 'TRH 2010', value: 'TRH2010' },
    ],
  },
  {
    name: 'hasHatirTasimasi',
    label: 'Hatır Taşıması İndirimi',
    type: 'switch' as const,
    col: 6,
  },
  {
    name: 'hasMuterafikKusur',
    label: 'Müterafik Kusur İndirimi',
    type: 'switch' as const,
    col: 6,
  },
];

// Validation şeması
const validationSchema2 = Yup.object().shape({
  eventType: Yup.string().required('Olay türü seçimi zorunludur'),
  eventDate: Yup.date().required('Olay tarihi zorunludur'),
  examinationDate: Yup.date()
    .required('Muayene tarihi zorunludur')
    .min(Yup.ref('eventDate'), 'Muayene tarihi olay tarihinden önce olamaz'),
  status: Yup.string().required('Durum seçimi zorunludur'),
  court: Yup.string().required('Mahkeme seçimi zorunludur'),
  faultRate: Yup.number()
    .required('Kusur oranı zorunludur')
    .min(0, 'Kusur oranı 0\'dan küçük olamaz')
    .max(100, 'Kusur oranı 100\'den büyük olamaz'),
  disabilityRate: Yup.number()
    .required('Maluliyet oranı zorunludur')
    .min(0, 'Maluliyet oranı 0\'dan küçük olamaz')
    .max(100, 'Maluliyet oranı 100\'den büyük olamaz'),
  sgkCapitalValue: Yup.number()
    .required('SGK peşin sermaye değeri zorunludur')
    .min(0, 'SGK peşin sermaye değeri 0\'dan küçük olamaz'),
  lifeTable: Yup.string().required('Yaşam tablosu seçimi zorunludur'),
  hasHatirTasimasi: Yup.boolean(),
  hasMuterafikKusur: Yup.boolean(),
});

const fields3 = [
  {
    name: 'predefinedNotes',
    label: 'Hazır Notlar',
    type: 'select' as const,
    options: [
      { label: 'Not 1', value: 'note1' },
      { label: 'Not 2', value: 'note2' },
      { label: 'Not 3', value: 'note3' },
    ],
  },
  {
    name: 'notes',
    label: 'Notlar',
    type: 'textarea' as const,
    placeholder: 'Notlarınızı buraya yazınız...',
    rows: 4,
  },
];

// Validation şeması
const validationSchema3 = Yup.object().shape({
  predefinedNotes: Yup.string(),
  notes: Yup.string(),
});

export const IncapacityCompensationNew = () => {
  const form1Ref = useRef<FormikProps<any>>(null);
  const form2Ref = useRef<FormikProps<any>>(null);
  const form3Ref = useRef<FormikProps<any>>(null);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [isNonInvoicedExpenseOpen, setIsNonInvoicedExpenseOpen] = useState(false);

  const fields = [
    {
      name: 'firstName',
      label: 'Adı',
      type: 'text' as const,
      required: true,
      placeholder: 'Adınızı giriniz',
    },
    {
      name: 'lastName',
      label: 'Soyadı',
      type: 'text' as const,
      required: true,
      placeholder: 'Soyadınızı giriniz',
    },
    {
      name: 'birthDate',
      label: 'Doğum Tarihi',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'tckn',
      label: 'TCKN',
      type: 'text' as const,
      required: true,
      placeholder: 'TC Kimlik Numaranızı giriniz',
      maxLength: 11,
    },
    {
      name: 'gender',
      label: 'Cinsiyeti',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Erkek', value: 'male' },
        { label: 'Kadın', value: 'female' },
      ],
    },
    {
      name: 'maritalStatus',
      label: 'Medeni Hali',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Bekar', value: 'single' },
        { label: 'Evli', value: 'married' },
        { label: 'Boşanmış', value: 'divorced' },
        { label: 'Dul', value: 'widowed' },
      ],
    },
    {
      name: 'militaryStatus',
      label: 'Askerlik Durumu',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Yapıldı', value: 'completed' },
        { label: 'Muaf', value: 'exempt' },
        { label: 'Yapılmadı', value: 'notCompleted' },
      ],
    },
    {
      name: 'fatherName',
      label: 'Baba Adı',
      type: 'text' as const,
      required: true,
      placeholder: 'Baba adını giriniz',
    },
    {
      name: 'employmentStatus',
      label: 'Çalışma Durumu',
      type: 'select' as const,
      required: true,
      options: [
        { label: 'Çalışıyor', value: 'employed' },
        { label: 'Çalışmıyor', value: 'unemployed' },
        { label: 'Emekli', value: 'retired' },
      ],
    },
    {
      name: 'monthlyIncome',
      label: 'Aylık Net Gelir',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
    },
    {
      name: 'isMinimumWage',
      label: 'Asgari Ücret Tarifesi',
      type: 'switch' as const,
    },
  ];

  const handleSubmit = async () => {
    try {
      // Tüm formları submit et
      await Promise.all([
        form1Ref.current?.submitForm(),
        form2Ref.current?.submitForm(),
        form3Ref.current?.submitForm()
      ]);

      // Tüm formların validation durumunu kontrol et
      const isForm1Valid = await form1Ref.current?.validateForm();
      const isForm2Valid = await form2Ref.current?.validateForm();
      const isForm3Valid = await form3Ref.current?.validateForm();

      const values1 = form1Ref.current?.values;
      const values2 = form2Ref.current?.values;
      const values3 = form3Ref.current?.values;

      // Eğer tüm formlar geçerliyse
      if (
        Object.keys(isForm1Valid || {}).length === 0 &&
        Object.keys(isForm2Valid || {}).length === 0 &&
        Object.keys(isForm3Valid || {}).length === 0
      ) {
        const allValues = {
          ...values1,
          ...values2,
          ...values3,
        };

        console.log(allValues);
        // Burada form başarıyla geçerli olduğunda yapılacak işlemleri ekleyebilirsiniz
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleNonInvoicedExpenseSubmit = (values: any) => {
    console.log('Fatura edilemeyen gider:', values);
    // Burada gider verilerini işleyebilirsiniz
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
            }}
            fields={fields2}
            validationSchema={validationSchema2}
            hideSubmitButton
          />
        </Panel>

        <Panel title="Rapor Notları">
          <Form
            formRef={form3Ref}
            initialValues={{
              predefinedNotes: '',
              notes: '',
            }}
            fields={fields3}
            validationSchema={validationSchema3}
            hideSubmitButton
          />
        </Panel>
      </div>

      <div className="flex gap-4 justify-between">
        <div className="flex gap-4">
          <Button 
            color="primary"
            onPress={() => setIsDocumentUploadOpen(true)}
          >
            Evrak Ekle
          </Button>
          <Button 
            color="primary"
            onPress={() => setIsNonInvoicedExpenseOpen(true)}
          >
            Fatura Edilemeyen Gider Ekle
          </Button>
        </div>
        <Button color="success" onPress={handleSubmit}>Hesapla</Button>
      </div>

      <DocumentUploadSidebar 
        isOpen={isDocumentUploadOpen}
        onClose={() => setIsDocumentUploadOpen(false)}
      />

      <NonInvoicedExpenseDrawer
        isOpen={isNonInvoicedExpenseOpen}
        onClose={() => setIsNonInvoicedExpenseOpen(false)}
      />
    </div>
  );
};
