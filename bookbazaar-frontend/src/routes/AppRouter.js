import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BookList from '../pages/BookList';
import BookDetail from '../pages/BookDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import CreateBook from '../pages/CreateBook';
import EditBook from '../pages/EditBook';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/books/new" element={<PrivateRoute allowedRoles={['SELLER', 'BOTH']}><CreateBook /></PrivateRoute>} />
      <Route path="/books/:id/edit" element={<PrivateRoute allowedRoles={['SELLER', 'BOTH']}><EditBook /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;