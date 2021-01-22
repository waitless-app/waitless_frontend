import axios from 'axios';
import { getItem } from '../utils/localstorage';
import { API_URL } from '../utils/constants';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getItem('access_token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

export default instance;