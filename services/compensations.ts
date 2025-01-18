import { Expense } from '@/container/is-goremezlik-tazminati/action';
import { api } from '@/libs/axios-instance';

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

const getCompensatios = async (): Promise<any> => {
  try {
    const response = await api.get('/compensations', {params: {page: 1, pageSize: 10}});
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

export const compensationService = {
  create: createCompensation,
  list: getCompensatios,
  detail: getCompensatiosDetail,
};

