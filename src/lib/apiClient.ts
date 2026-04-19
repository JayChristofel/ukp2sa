import axios from "axios";

// Instance for Diswatch API (diswatchapi.tilikan.id)
export const banjirApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BANJIR_SUMATRA_API || "https://diswatchapi.tilikan.id/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Instance for Banjir Sumatra Public API (api.banjirsumatra.id)
const BANJIR_SUMATRA_BASE = process.env.NEXT_PUBLIC_BUILD_MODE === 'mobile' 
  ? "https://api.banjirsumatra.id/api/v1" 
  : "/api/v1/external-banjir";

export const banjirSumatraApi = axios.create({
  baseURL: BANJIR_SUMATRA_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Instance for SuperDash / Tilikan API
export const tilikanApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPERDASH_API || "https://superdashapi.tilikan.id/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Response Interceptor for basic error handling
const handleResponse = (response: any) => response;
const handleError = (error: any) => {
  const url = error.config?.url;
  const method = error.config?.method?.toUpperCase();

  if (error.response) {
    const status = error.response.status;
    console.error(`🔴 [API ERROR] ${method} ${url} | Status: ${status}`);
    
    const contentType = error.response.headers?.['content-type'] || '';
    if (contentType.includes('application/json')) {
      const payload = error.response.data;
      const hasContent = payload && typeof payload === 'object' && Object.keys(payload).length > 0;
      if (hasContent) console.error("📦 Payload:", payload);
      else console.warn("📦 Payload: (Empty Object or Array)");
    } else {
      console.warn("⚠️ Payload is not JSON (likely an error page or text).");
    }
  } else if (error.request) {
    console.error(`[NETWORK ERROR] ${method} ${url} | No response received`);
  } else {
    console.error(`[REQUEST SETUP ERROR] ${error.message}`);
  }
  
  return Promise.resolve({ 
    data: { data: [], items: [], success: false, error: true, status: error.response?.status } 
  });
};

// Instance for Local UKP2SA API
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || 
  (process.env.NEXT_PUBLIC_API_URL?.endsWith('/api') 
    ? process.env.NEXT_PUBLIC_API_URL 
    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api`);

export const localApi = axios.create({
  baseURL: LOCAL_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

localApi.interceptors.response.use(handleResponse, handleError);
banjirApi.interceptors.response.use(handleResponse, handleError);
tilikanApi.interceptors.response.use(handleResponse, handleError);
banjirSumatraApi.interceptors.response.use(handleResponse, handleError);

/**
 * Ensures the input is always an array. 
 */
export function ensureArray<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.items && Array.isArray(data.items)) return data.items;
  return [];
}
