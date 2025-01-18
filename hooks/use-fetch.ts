import { useState, useEffect } from 'react';
import { api } from '@/libs/axios-instance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchOptions extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
}

export function useFetch<T>(url: string, options: FetchOptions = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {

    const controller = new AbortController();
    let attempts = 0;
    const maxRetries = options.retries ?? 3;
    const retryDelay = options.retryDelay ?? 1000;

    const fetchData = async () => {
      try {

        const axiosConfig: AxiosRequestConfig = {
          url,
          method: options.method || 'GET',
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          },
          data: options.data
        };

        const response: AxiosResponse<T> = await api(axiosConfig);

        setState({
          data: response?.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error)
        if (attempts < maxRetries && !(error instanceof Error && error.name === 'AbortError')) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          fetchData();
          return;
        }

        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Bir hata oluştu'),
        });
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const axiosConfig: AxiosRequestConfig = {
        url,
        method: options.method || 'GET',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        data: options.data
      };

      const response: AxiosResponse<T> = await api(axiosConfig);

      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Bir hata oluştu'),
      });
    }
  };

  return {
    ...state,
    refetch,
  };
}