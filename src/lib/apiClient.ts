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
export const banjirSumatraApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BANJIR_SUMATRA_PUBLIC_API || "https://api.banjirsumatra.id/api/v1",
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
    // Server responded with non-2xx status
    console.error(`[API ERROR] ${method} ${url} | Status: ${error.response.status}`);
    
    // Check if response is actually JSON before logging payload
    const contentType = error.response.headers?.['content-type'] || '';
    if (contentType.includes('application/json')) {
      console.error("Payload:", error.response.data);
    } else {
      console.warn("Payload is not JSON (likely an error page).");
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error(`[NETWORK ERROR] ${method} ${url} | No response received`);
  } else {
    // Something happened during setup
    console.error(`[REQUEST SETUP ERROR] ${error.message}`);
  }
  
  // Return a graceful empty response structure to prevent downstream crashes
  return Promise.resolve({ data: { data: [], items: [], success: false, error: true } });
};

// Instance for Local UKP2SA API
export const localApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api`,
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
