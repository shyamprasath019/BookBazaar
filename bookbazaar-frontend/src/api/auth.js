import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const register = (email, password, accountType, profileData) => {
  return axios.post(`${API_URL}/register`, {
    email,
    password,
    accountType,
    profile: profileData
  });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password
  }).then(response => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  register,
  login,
  logout,
  getCurrentUser
};