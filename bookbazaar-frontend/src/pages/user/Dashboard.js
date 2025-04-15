import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await axios.get('/api/orders/user?limit=5');
        setRecentOrders(res.data);
      } catch (err) {
        setError('Error fetching recent orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentOrders();
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
      <div className="row mb-4">
        <div className="col-md-8">
          <h1>Welcome, {user && user.name}</h1>
          <p className="lead">Manage your account and orders here.</p>
        </div>
        <div className="col-md-4 text-right">
          {user && user.role !== 'seller' && (
            <Link to="/seller/apply" className="btn btn-outline-primary">
              Become a Seller
            </Link>
          )}
          {user && user.role === 'seller' && (
            <Link to="/seller/dashboard" className="btn btn-primary">
              Seller Dashboard
            </Link>
          )}
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card border-primary h-100">
            <div className="card-body text-center">
              <i className="fas fa-user fa-3x mb-3 text-primary"></i>
              <h4 className="card-title">My Profile</h4>
              <p className="card-text">Manage your personal information and preferences.</p>
              <Link to="/profile" className="btn btn-primary">
                View Profile
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card border-success h-100">
            <div className="card-body text-center">
              <i className="fas fa-shopping-bag fa-3x mb-3 text-success"></i>
              <h4 className="card-title">My Orders</h4>
              <p className="card-text">View and track all your orders and purchases.</p>
              <Link to="/orders" className="btn btn-success">
                View Orders
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card border-info h-100">
            <div className="card-body text-center">
              <i className="fas fa-heart fa-3x mb-3 text-info"></i>
              <h4 className="card-title">Wishlist</h4>
              <p className="card-text">View and manage your wishlist of favorite books.</p>
              <Link to="/wishlist" className="btn btn-info">
                View Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Recent Orders</h5>
        </div>
        <div className="card-body">
          {recentOrders.length === 0 ? (
            <p className="text-center py-3">
              You haven't placed any orders yet.{' '}
              <Link to="/">Browse books</Link> to get started.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.substring(0, 8)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            order.status === 'delivered'
                              ? 'success'
                              : order.status === 'shipped'
                              ? 'info'
                              : order.status === 'processing'
                              ? 'warning'
                              : 'secondary'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/orders/${order._id}`} className="btn btn-sm btn-outline-primary">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="text-center mt-3">
            <Link to="/orders" className="btn btn-outline-primary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;