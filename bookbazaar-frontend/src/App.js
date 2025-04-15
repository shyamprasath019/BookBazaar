import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import UserOrders from './pages/user/Orders'; 
import SellerDashboard from './pages/seller/Dashboard';
import SellerBooks from './pages/seller/Books';
import SellerAddBook from './pages/seller/AddBook';
import SellerEditBook from './pages/seller/EditBook';
import SellerSales from './pages/seller/Sales';
import SellerAnalytics from './pages/seller/Analytics';
import PrivateRoute from './components/routing/PrivateRoute';
import SellerRoute from './components/routing/SellerRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected routes for all authenticated users */}
              <Route element={<PrivateRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/orders" element={<UserOrders />} />
              </Route>
              
              {/* Protected routes for sellers only */}
              <Route element={<SellerRoute />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/books" element={<SellerBooks />} />
                <Route path="/seller/books/add" element={<SellerAddBook />} />
                <Route path="/seller/books/edit/:id" element={<SellerEditBook />} />
                <Route path="/seller/sales" element={<SellerSales />} />
                <Route path="/seller/analytics" element={<SellerAnalytics />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
