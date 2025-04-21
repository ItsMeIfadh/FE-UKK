import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/user', // untuk profile
    meUpdate: '/api/user/update-profile', // untuk profile
    login: '/api/login',
    register: '/api/auth/register',
    logout: '/api/logout',
  },
  user: {
    list: '/api/users',
    create: '/api/users/create',
    update: '/api/users/update',
    delete: '/api/users/delete',
    getById: '/api/users/detail',
  },
  product: {
    list: '/api/products',
    create: '/api/products',
    delete: '/api/products',
    update: '/api/products',
    details: '/api/products',
    search: '/api/product/search',
  },
  kategori: {
    list: '/api/categories',
    create: '/api/products',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  cart: {
    all: '/api/cart',
    add: '/api/cart/add',
    update: '/api/cart/update',
    delete: '/api/cart/delete',
  },

  // mail: {
  //   list: '/api/mail/list',
  //   details: '/api/mail/details',
  //   labels: '/api/mail/labels',
  // },
};
