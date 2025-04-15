import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // Fetch seller statistics
        const statsRes = await axios.get('/api/seller/stats');
        setStats(statsRes.data);
        
        // Fetch recent sales
        const salesRes = await axios.get('/api/seller/sales?limit=5');
        setRecentSales(salesRes.data);
      } catch (err) {
        setError('Error fetching seller data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellerData();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Seller Dashboard</h1>
          <p className="lead">Welcome back, {user && user.name}</p>
        </div>
        <Link to="/seller/books/add" className="btn btn-success">
          <i className="fas fa-plus mr-2"></i>
          Add New Book
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Books Listed</h6>
                  <h2 className="mb-0">{stats.totalBooks}</h2>
                </div>
                <i className="fas fa-book fa-2x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/seller/books" className="text-white">
                View Details
              </Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Total Sales</h6>
                  <h2 className="mb-0">{stats.totalSales}</h2>
                </div>
                <i className="fas fa-shopping-cart fa-2x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/seller/sales" className="text-white">
                View Details
              </Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Revenue</h6>
                  <h2 className="mb-0">${stats.totalRevenue.toFixed(2)}</h2>
                </div>
                <i className="fas fa-dollar-sign fa-2x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/seller/analytics" className="text-white">
                View Details
              </Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Pending Orders</h6>
                  <h2 className="mb-0">{stats.pendingOrders}</h2>
                </div>
                <i className="fas fa-clock fa-2x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/seller/orders?status=pending" className="text-white">
                View Details
              </Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Sales */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Recent Sales</h5>
        </div>
        <div className="card-body">
          {recentSales.length === 0 ? (
            <p className="text-center py-3">No sales data available yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Book</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(sale => (
                    <tr key={sale._id}>
                      <td>#{sale.orderId.substring(0, 8)}</td>
                      <td>{sale.book.title}</td>
                      <td>{sale.customer.name}</td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>${sale.amount.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            sale.status === 'delivered'
                              ? 'success'
                              : sale.status === 'shipped'
                              ? 'info'
                              : sale.status === 'processing'
                              ? 'warning'
                              : 'secondary'
                          }`}
                        >
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="text-center mt-3">
            <Link to="/seller/sales" className="btn btn-outline-primary">
              View All Sales
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Manage Inventory</h5>
              <p className="card-text">Add, update, or remove books from your inventory.</p>
              <Link to="/seller/books" className="btn btn-primary">
                Manage Books
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">View Analytics</h5>
              <p className="card-text">Track sales, revenue, and customer trends.</p>
              <Link to="/seller/analytics" className="btn btn-info">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Seller Settings</h5>
              <p className="card-text">Manage your store preferences and profile.</p>
              <Link to="/seller/settings" className="btn btn-secondary">
                Seller Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
