import { getAuth } from '@/auth/lib/helpers';
import axios from 'axios';
import { convertDatesToISODate, convertISOStringsToDates } from '@/lib/date';

const serverApiAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  // Leave headers undefined to let Axios set proper header type
  headers: undefined as any,
});

serverApiAxios.interceptors.request.use((config) => {
  // Attach Bearer token from local storage when available
  try {
    const auth = getAuth();
    if (auth?.accessToken) {
      // Ensure headers is an object we can index into. Use any to satisfy Axios types.
      config.headers = config.headers ?? ({} as any);
      // Ensure we don't overwrite an existing Authorization header
      if (!('Authorization' in (config.headers as Record<string, any>))) {
        (config.headers as Record<string, string>)['Authorization'] =
          `Bearer ${auth.accessToken}`;
      }
    }
  } catch (error) {
    // silent fail - attaching token is best-effort
    // console.error('Failed to attach auth token to request', error);
  }
  if (config.data && !(config.data instanceof FormData)) {
    config.data = convertDatesToISODate(config.data);
  }
  return config;
});

serverApiAxios.interceptors.response.use(
  (response) => {
    try {
      // Nếu response là blob/binary (ví dụ khi tải file), không cố parse JSON/strings
      const respType = response?.config?.responseType;
      const isBlob = respType === 'blob' || response?.data instanceof Blob;

      if (!isBlob && response && response.data) {
        response.data = convertISOStringsToDates(response.data);
      }
    } catch (err) {
      // nếu parse lỗi, không block response — trả về nguyên gốc
    }
    return response;
  },
  (error) => {
    // Nếu response lỗi từ server có payload chứa các ISO string, parse luôn để dễ xử lý lỗi ở client
    try {
      if (error?.response?.data) {
        error.response.data = convertISOStringsToDates(error.response.data);
      }
    } catch (err) {
      // ignore
    }
    return Promise.reject(error);
  },
);

export { serverApiAxios };
