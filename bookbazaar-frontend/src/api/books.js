import axios from 'axios';

const API_URL = 'http://localhost:8080/api/books';

const getAllBooks = (params) => {
  return axios.get(API_URL, { params });
};

const getBookById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createBook = (bookData, token) => {
  return axios.post(API_URL, bookData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

const updateBook = (id, bookData, token) => {
  return axios.put(`${API_URL}/${id}`, bookData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

const deleteBook = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export default {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};