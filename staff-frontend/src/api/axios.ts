import axos from 'axios';

const API = axos.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const setAuthToken = (token: string) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
