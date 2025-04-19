import { object, ref, string, number, boolean } from "yup";

export const LoginSchema = object().shape({
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
  name: string().required("Name is required"),
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});

export const ProfileSchema = object().shape({
  id: string().required("ID is required"),
  name: string().required("Ad alanı zorunludur"),
  surname: string().required("Soyad alanı zorunludur"),
  email: string()
    .email("Geçerli bir e-posta adresi giriniz")
    .required("E-posta alanı zorunludur"),
  password: string().nullable(),
  confirmPassword: string()
    .nullable()
    .when("password", {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema
        .required("Şifre onayı zorunludur")
        .oneOf([ref("password")], "Şifreler eşleşmiyor"),
    }),
});

export const IncapacityApprovalSchema = object().shape({
  id: string().required("ID is required"),
  disabilityRate: number()
    .min(0, "Engel oranı 0 veya daha büyük olmalıdır")
    .max(100, "Engel oranı 100 veya daha küçük olmalıdır")
    .required("Engel oranı zorunludur"),
  hasTemporaryDisability: boolean().required("Geçici engel durumu seçilmelidir"),
  hasCaregiver: boolean().required("Hemşirelik bakım durumu seçilmelidir"),
  temporaryDisabilityDay: number()
    .min(0, "Geçici engel günü 0 veya daha büyük olmalıdır")
    .required("Geçici engel günü zorunludur"),
});

export const IncapacityCompensationApprovalSchema = object().shape({
  id: string().required("ID is required"),
  compensationAmount: number()
    .min(0, "Tazminat tutarı 0 veya daha büyük olmalıdır")
    .required("Tazminat tutarı zorunludur"),
  compensationDate: string()
    .required("Tazminat tarihi zorunludur"),
  compensationType: string()
    .required("Tazminat türü zorunludur"),
});
