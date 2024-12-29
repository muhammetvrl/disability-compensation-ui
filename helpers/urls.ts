export const ROUTES = {
  HOME: '/',
  IS_GOREMEZLIK: {
    LIST: '/is-goremezlik-tazminati',
    NEW: '/is-goremezlik-tazminati/yeni-hesaplama',
    DETAIL: (id: string) => `/is-goremezlik-tazminati/${id}`,
  },
  DESTEK_YOKSUN_KALMA_TAZMINATI: {
    LIST: '/destekten-yoksun-kalma-tazminati/liste',
    NEW: '/destekten-yoksun-kalma-tazminati/yeni-hesaplama',
    DETAIL: (id: string) => `/destekten-yoksun-kalma-tazminati/${id}`,
  },
} as const;
