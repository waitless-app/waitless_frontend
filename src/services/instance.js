import axios from 'axios';
import { getItem, removeItem } from '../utils/localstorage';
import { API_URL } from '../utils/constants';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getItem('access_token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers.common['Access-Control-Allow-Origin'] = '*';
    // eslint-disable-next-line no-param-reassign
    config.headers.common['X-Source-Web'] = true;
    return config;
  },
  (err) => Promise.reject(err),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      removeItem('access_token');
      const loginURL = `${window.location.origin}/login`;
      window.location.href = loginURL;
    } else {
      return Promise.reject(error);
    }
    return null;
  },
);

export default instance;
