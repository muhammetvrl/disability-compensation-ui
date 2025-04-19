// FORMS

export type LoginFormType = {
  email: string;
  password: string;
};

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ProfileFormType = {
  id: string;
  email: string;
  name: string;
  surname: string;
  password?: string;
  confirmPassword?: string;
};

export type IncapacityApprovalForm = {
  id: string;
  disabilityRate: string;
  hasTemporaryDisability: boolean;
  hasCaregiver: boolean;
  temporaryDisabilityDay: string;
};

export interface ClaimRecord {
  fileNo: string;
  fullName: string; 
  claimFileNo: string;
  reportDate: string;
  fileOwner: string;
  approver: string;
  status: string;
}