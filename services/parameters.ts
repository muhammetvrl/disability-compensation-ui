import { api } from '@/libs/axios-instance';

const search = async (payload: { codes: string[] }): Promise<any> => {
  try {
    const response = await api.post('/parameters/search', payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const parameterService = {
  search: search,
};

