import { Expense } from '@/container/is-goremezlik-tazminati/action';
import { api } from '@/libs/axios-instance';
import { DateValue } from '@nextui-org/react';

interface IClaimant {
  name: string;
  surname: string;
  birthDate: string;
  tckn: string;
  gender: string;
  maritalStatus: string;
  militaryStatus: string;
  fatherName: string;
  employmentStatus: string;
  monthlyIncome: number;
  isMinimumWage: boolean;
}

interface IEvent {
  eventType: string;
  eventDate: string;
  examinationDate: string;
}

export interface IDocument {
  documentType: string;
  referenceNo: string;
  date: string;
  file: string;
}

export interface ICompensationRequest {
  predefinedNote: string;
  note: string;
  claimant: IClaimant;
  event: IEvent;
  expenses: Expense[];
  documents: IDocument[];
}

const createCompensation = async (payload: ICompensationRequest): Promise<any> => {
  try {
    const response = await api.post('/compensations', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const getCompensations = async (filter: { page: number, pageSize: number, date: DateValue | null, status: number | null | undefined }): Promise<any> => {
  try {
    const response = await api.get('/compensations', { params: filter });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCompensatiosDetail = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/compensations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const rejectCompensation = async (id: string, payload: {
  id: string,
  rejectReason: string
}): Promise<any> => {
  try {
    const response = await api.patch(`/compensations/${id}/reject`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};


const approveCompensation = async (id: string, payload: {
  id: string,
  disabilityRate: number,
  hasTemporaryDisability: boolean,
  hasCaregiver: boolean,
  temporaryDisabilityDay: number
}): Promise<any> => {
  try {
    const response = await api.patch(`/compensations/${id}/approve`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const compensationService = {
  create: createCompensation,
  list: getCompensations,
  detail: getCompensatiosDetail,
  reject: rejectCompensation,
  approve: approveCompensation,
};

