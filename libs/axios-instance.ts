import axios, { 
  AxiosError, 
  AxiosInstance, 
  InternalAxiosRequestConfig,
  AxiosResponse 
} from 'axios'
import { getBaseUrl } from './env'

// Cookie'den token'ı almak için yardımcı fonksiyon
export const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('userAuth='))
  if (!tokenCookie) return null
  return tokenCookie.split('=')[1].trim()
}

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
      const token = typeof window !== 'undefined' ? getTokenFromCookie() : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error)
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response?.data,
    (error: AxiosError) => {
      const response = error.response

      // API hatalarını özelleştirilmiş hata sınıfına dönüştür
      console.log("🚀 ~ createAxiosInstance ~ response:", response)
      if (response) {
        
        if(response.status === 401) {
          window.location.href = '/login'
        }

        throw new ApiError(
          response.status,
          (response.data as any)?.message || 'Bir hata oluştu',
          response.data
        )
      }
    }
  )

  return instance
}

export const api = createAxiosInstance()