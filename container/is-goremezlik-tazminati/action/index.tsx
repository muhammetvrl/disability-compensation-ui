"use client";
import { Breadcrumbs, BreadcrumbItem, Button } from "@heroui/react";
import React, { useRef, useState } from "react";
import Panel from "@/components/panel/panel";
import * as Yup from "yup";
import { Form } from "@/components/form/form";
import { FormikProps } from "formik";
import { DocumentUploadSidebar } from "../document-upload-sidebar";
import { NonInvoicedExpenseDrawer } from "../non-invoiced-expense-drawer";
import { useRouter } from "next/navigation";
import {
  compensationService,
  ICompensationRequest,
  IDocument,
} from "@/services/compensations";
import { useFetch } from "@/hooks/use-fetch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    Name: Yup.string().required("Ad zorunludur"),
    Surname: Yup.string().required("Soyad zorunludur"),
    BirthDate: Yup.date().required("Doğum tarihi zorunludur"),
    TCKN: Yup.string()
      .required("TCKN zorunludur")
      .matches(/^[0-9]{11}$/, "TCKN 11 haneli olmalıdır"),
    Gender: Yup.string().required("Cinsiyet seçimi zorunludur"),
    MaritalStatus: Yup.string().required("Medeni hal seçimi zorunludur"),
    MilitaryStatus: Yup.string().when("Gender", {
      is: (gender: string) => {
        const genderLower = gender?.toLowerCase();
        return genderLower !== "female" && genderLower !== "kadın";
      },
      then: (schema) => schema.required("Askerlik durumu seçimi zorunludur"),
      otherwise: (schema) => schema.notRequired(),
    }),
    FatherName: Yup.string().required("Baba adı zorunludur"),
    EmploymentStatus: Yup.string().required("Çalışma durumu seçimi zorunludur"),
    MonthlyIncome: Yup.number().when(["EmploymentStatus", "IsMinimumWage"], {
      is: (employmentStatus: string, isMinimumWage: boolean) => {
        const statusLower = employmentStatus?.toLowerCase();
        const isNotUnemployed =
          statusLower !== "unemployed" && statusLower !== "çalışmıyor";
        return isNotUnemployed && !isMinimumWage;
      },
      then: (schema) =>
        schema
          .required("Aylık gelir zorunludur")
          .min(0, "Gelir 0'dan küçük olamaz"),
      otherwise: (schema) =>
        schema.notRequired().min(0, "Gelir 0'dan küçük olamaz"),
    }),
    IsMinimumWage: Yup.boolean(),
  }),
});

// Validation şeması
const validationSchema2 = Yup.object().shape({
  Event: Yup.object().shape({
    EventType: Yup.string().required("Olay türü seçimi zorunludur"),
    EventDate: Yup.date().required("Olay tarihi zorunludur"),
    ExaminationDate: Yup.date()
      .required("Muayene tarihi zorunludur")
      .min(Yup.ref("EventDate"), "Muayene tarihi olay tarihinden önce olamaz"),
    LifeStatus: Yup.string().required("Durum seçimi zorunludur"),
    Court: Yup.string().notRequired(), // Made optional as per requirement #7
    FaultRate: Yup.number()
      .notRequired() // Made optional as per requirement #7
      .min(0, "Kusur oranı 0'dan küçük olamaz")
      .max(100, "Kusur oranı 100'den büyük olamaz"),
    DisabilityRate: Yup.number()
      .notRequired() // Made optional as per requirement #7
      .min(0, "Maluliyet oranı 0'dan küçük olamaz")
      .max(100, "Maluliyet oranı 100'den büyük olamaz"),
    SgkAdvanceCapital: Yup.number()
      .notRequired() // Made optional as per requirement #7
      .min(0, "SGK peşin sermaye değeri 0'dan küçük olamaz"),
    LifeTable: Yup.string().required("Yaşam tablosu seçimi zorunludur"),
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
  const [isNonInvoicedExpenseOpen, setIsNonInvoicedExpenseOpen] =
    useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Single request for all parameters
  const { data: allParameters } = useFetch<IParameter[]>("/parameters/search", {
    method: "POST",
    data: {
      codes: [
        "gender",
        "marital_status",
        "event_type",
        "military_status",
        "employment_status",
        "life_status",
        "court",
        "life_table",
        "predefined_notes",
      ],
    },
  });

  // Extract individual parameter arrays
  const genders = allParameters?.filter((p) => p.code === "gender");
  const maritalStatus = allParameters?.filter(
    (p) => p.code === "marital_status"
  );
  const eventTypes = allParameters?.filter((p) => p.code === "event_type");
  const militaryStatus = allParameters?.filter(
    (p) => p.code === "military_status"
  );
  const employmentStatus = allParameters?.filter(
    (p) => p.code === "employment_status"
  );
  const lifeStatus = allParameters?.filter((p) => p.code === "life_status");
  const courts = allParameters?.filter((p) => p.code === "court");
  const lifeTables = allParameters?.filter((p) => p.code === "life_table");
  const predefinedNotes = allParameters?.filter(
    (p) => p.code === "predefined_notes"
  );

  // Form state to track field dependencies
  const [formValues, setFormValues] = useState({
    gender: "",
    employmentStatus: "",
    isMinimumWage: false,
  });

  // Helper to check if female (case-insensitive)
  const isFemale = formValues.gender?.toLowerCase() === "female";

  // Helper to check if unemployed (case-insensitive)
  const isUnemployed =
    formValues.employmentStatus?.toLowerCase() === "unemployed" ||
    formValues.employmentStatus?.toLowerCase() === "çalışmıyor";

  console.log(
    "Form Values:",
    formValues,
    "isFemale:",
    isFemale,
    "isUnemployed:",
    isUnemployed
  );

  // Create fields array that updates when formValues change
  const fields = React.useMemo(
    () => [
      {
        name: "Claimant.Name",
        label: "Adı",
        type: "text" as const,
        required: true,
        placeholder: "Adınızı giriniz",
      },
      {
        name: "Claimant.Surname",
        label: "Soyadı",
        type: "text" as const,
        required: true,
        placeholder: "Soyadınızı giriniz",
      },
      {
        name: "Claimant.BirthDate",
        label: "Doğum Tarihi",
        type: "date" as const,
        required: true,
      },
      {
        name: "Claimant.TCKN",
        label: "TCKN",
        type: "text" as const,
        required: true,
        placeholder: "TC Kimlik Numaranızı giriniz",
        maxLength: 11,
      },
      {
        name: "Claimant.Gender",
        label: "Cinsiyeti",
        type: "select" as const,
        required: true,
        options: genders?.[0]?.values.map((item) => ({
          label: item.name,
          value: item.value,
        })),
      },
      {
        name: "Claimant.MaritalStatus",
        label: "Medeni Hali",
        type: "select" as const,
        required: true,
        options: maritalStatus?.[0]?.values.map((item) => ({
          label: item.name,
          value: item.value,
        })),
      },
      {
        name: "Claimant.MilitaryStatus",
        label: "Askerlik Durumu",
        disabled: isFemale,
        type: "select" as const,
        required: !isFemale,
        options: militaryStatus?.[0]?.values.map((item) => ({
          label: item.name,
          value: item.value,
        })),
      },
      {
        name: "Claimant.FatherName",
        label: "Baba Adı",
        type: "text" as const,
        required: true,
        placeholder: "Baba adını giriniz",
      },
      {
        name: "Claimant.EmploymentStatus",
        label: "Çalışma Durumu",
        type: "select" as const,
        required: true,
        options: employmentStatus?.[0]?.values.map((item) => ({
          label: item.name,
          value: item.value,
        })),
      },
      {
        name: "Claimant.MonthlyIncome",
        label: "Aylık Net Gelir",
        type: "number" as const,
        required: !isUnemployed && !formValues.isMinimumWage,
        disabled: isUnemployed || formValues.isMinimumWage,
        placeholder: "0",
      },
      {
        name: "Claimant.IsMinimumWage",
        label: "Asgari Ücret Tarifesi",
        type: "switch" as const,
        disabled: isUnemployed,
      },
    ],
    [
      formValues,
      genders,
      maritalStatus,
      militaryStatus,
      employmentStatus,
      isFemale,
      isUnemployed,
    ]
  );

  const eventFields = [
    {
      name: "Event.EventType",
      label: "Olay Türü",
      type: "select" as const,
      required: true,
      options: eventTypes?.[0]?.values.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    {
      name: "Event.EventDate",
      label: "Olay Tarihi",
      type: "date" as const,
      required: true,
    },
    {
      name: "Event.ExaminationDate",
      label: "Muayene Tarihi",
      type: "date" as const,
      required: true,
    },
    {
      name: "Event.LifeStatus",
      label: "Durum",
      type: "select" as const,
      required: true,
      options: lifeStatus?.[0]?.values.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    {
      name: "Event.Court",
      label: "Mahkeme",
      type: "select" as const,
      required: false, // Made optional as per requirement #7
      options: courts?.[0]?.values.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    {
      name: "Event.FaultRate",
      label: "Kusur Oranı",
      type: "number" as const,
      required: false, // Made optional as per requirement #7
      placeholder: "0.00",
      endContent: "%",
    },
    {
      name: "Event.DisabilityRate",
      label: "Maluliyet Oranı",
      type: "number" as const,
      required: false, // Made optional as per requirement #7
      placeholder: "0.00",
      endContent: "%",
    },
    {
      name: "Event.SgkAdvanceCapital",
      label: "SGK Peşin Sermaye Değeri",
      type: "number" as const,
      required: false, // Made optional as per requirement #7
      placeholder: "0.00",
      endContent: "₺",
    },
    {
      name: "Event.LifeTable",
      label: "Yaşam Tablosu",
      type: "select" as const,
      required: true,
      options: lifeTables?.[0]?.values.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    {
      name: "Event.IsFavorTransportDiscount",
      label: "Hatır Taşıması İndirimi",
      type: "switch" as const,
      col: 6,
    },
    {
      name: "Event.IsMutualFaultDiscount",
      label: "Müterafik Kusur İndirimi",
      type: "switch" as const,
      col: 6,
    },
  ];

  const fields3 = [
    {
      name: "PredefinedNote",
      label: "Hazır Notlar",
      type: "select" as const,
      options: predefinedNotes?.[0]?.values.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    },
    {
      name: "Note",
      label: "Notlar",
      type: "textarea" as const,
      placeholder: "Notlarınızı buraya yazınız...",
      rows: 4,
    },
  ];

  const handleSubmit = async () => {
    try {
      await Promise.all([
        form1Ref.current?.submitForm(),
        form2Ref.current?.submitForm(),
        form3Ref.current?.submitForm(),
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
          BirthDate: format(
            new Date(form1Ref.current?.values.Claimant.BirthDate),
            "yyyy-MM-dd"
          ),
        };

        const eventData = {
          ...form2Ref.current?.values.Event,
          EventDate: formatDateToUTC(form2Ref.current?.values.Event.EventDate),
          ExaminationDate: formatDateToUTC(
            form2Ref.current?.values.Event.ExaminationDate
          ),
        };

        const formData = new FormData();

        // Ana form verileri
        formData.append(
          "PredefinedNote",
          form3Ref.current?.values.PredefinedNote
        );
        formData.append("Note", form3Ref.current?.values.Note);

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
          formData.append(
            `Expenses[${index}].ExpenseType`,
            expense.expenseType
          );
          formData.append(
            `Expenses[${index}].ReferenceNo`,
            expense.referenceNo
          );
          formData.append(`Expenses[${index}].Date`, expense.date);
          formData.append(
            `Expenses[${index}].Amount`,
            expense.amount.toString()
          );
          formData.append(`Expenses[${index}].File`, expense.file);
        });

        // Documents array'i için
        documents.forEach((document, index) => {
          formData.append(
            `Documents[${index}].DocumentType`,
            document.documentType
          );
          formData.append(
            `Documents[${index}].ReferenceNo`,
            document.referenceNo
          );
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
          console.error("Hata oluştu:", error);
          toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      }
    } catch (error) {
      console.error("Form validation failed:", error);
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
                Name: "",
                Surname: "",
                BirthDate: "",
                TCKN: "",
                Gender: "",
                MaritalStatus: "",
                MilitaryStatus: "",
                FatherName: "",
                EmploymentStatus: "",
                MonthlyIncome: 0,
                IsMinimumWage: false,
              },
            }}
            fields={fields}
            validationSchema={validationSchema}
            hideSubmitButton
            onFieldChange={(fieldName: string, value: any) => {
              if (fieldName === "Claimant.Gender") {
                setFormValues((prev) => ({ ...prev, gender: value }));
                // Clear military status if gender is female (case-insensitive)
                const valueLower = value?.toLowerCase();
                if (valueLower === "female" || valueLower === "kadın") {
                  form1Ref.current?.setFieldValue(
                    "Claimant.MilitaryStatus",
                    ""
                  );
                }
              } else if (fieldName === "Claimant.EmploymentStatus") {
                setFormValues((prev) => ({ ...prev, employmentStatus: value }));
                // Clear income and minimum wage if unemployed (case-insensitive)
                const valueLower = value?.toLowerCase();
                if (
                  valueLower === "unemployed" ||
                  valueLower === "çalışmıyor"
                ) {
                  form1Ref.current?.setFieldValue("Claimant.MonthlyIncome", 0);
                  form1Ref.current?.setFieldValue(
                    "Claimant.IsMinimumWage",
                    false
                  );
                  setFormValues((prev) => ({ ...prev, isMinimumWage: false }));
                }
              } else if (fieldName === "Claimant.IsMinimumWage") {
                setFormValues((prev) => ({ ...prev, isMinimumWage: value }));
                // Clear monthly income if minimum wage is selected
                if (value) {
                  form1Ref.current?.setFieldValue("Claimant.MonthlyIncome", 0);
                }
              }
            }}
          />
        </Panel>

        <Panel title="Olay Bilgileri">
          <Form
            formRef={form2Ref}
            initialValues={{
              Event: {
                EventType: "",
                EventDate: "",
                ExaminationDate: "",
                Status: "",
                Court: 1,
                FaultRate: 0,
                DisabilityRate: 0,
                SgkCapitalValue: 0,
                LifeTable: "",
                IsFavorTransportDiscount: false,
                IsMutualFaultDiscount: false,
              },
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
              PredefinedNote: "",
              Note: "",
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
        <Button
          color="success"
          onPress={handleSubmit}
          className="w-full md:w-auto"
        >
          Hesapla
        </Button>
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
