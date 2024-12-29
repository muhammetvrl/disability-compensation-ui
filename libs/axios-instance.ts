import axios, { 
  AxiosError, 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse 
} from 'axios'
import { getBaseUrl } from './env'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })


  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error)
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      const response = error.response

      // API hatalarını özelleştirilmiş hata sınıfına dönüştür
      if (response) {
        throw new ApiError(
          response.status,
          (response.data as any)?.message || 'Bir hata oluştu',
          response.data
        )
      }

      // Ağ hatası veya timeout durumu
      throw new ApiError(
        500,
        'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.',
      )
    }
  )

  return instance
}

export const api = createAxiosInstance()