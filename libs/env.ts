export function getBaseUrl(): string {
    // Debug: log environment variable
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
    
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }
  
    // Fallback URL for development
    if (process.env.NODE_ENV === 'development') {
      return 'http://37.148.210.127:8080/api'
    }
  
    throw new Error('API URL bulunamadı')
  }