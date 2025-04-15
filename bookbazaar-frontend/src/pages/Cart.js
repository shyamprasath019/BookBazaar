import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchCart = async () => {
      try {
        const res = await axios.get('/api/cart');
        setCartItems(res.data);
      } catch (err) {
        setError('Error loading cart');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [isAuthenticated, navigate]);
  
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    
    try {
      await axios.put(`/api/cart/${id}`, { quantity });
      
      setCartItems(cartItems.map(item => 
        item._id === id ? { ...item, quantity } : item
      ));
    } catch (err) {
      setError('Error updating cart');
      console.error(err);
    }
  };
  
  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      
      setCartItems(cartItems.filter(item => item._id !== id));
    } catch (err) {
      setError('Error removing item from cart');
      console.error(err);
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  };
  
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
      <h1 className="mb-4">Shopping Cart</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h3>Your cart is empty</h3>
          <p>Browse our collection and add some books to your cart.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Book</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.book.coverImage || 'https://via.placeholder.com/50x70'}
                          alt={item.book.title}
                          className="mr-3"
                          style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                        />
                        <div>
                          <h5 className="mb-1">{item.book.title}</h5>
                          <p className="text-muted mb-0">by {item.book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td>${item.book.price.toFixed(2)}</td>
                    <td>
                      <div className="input-group" style={{ width: '120px' }}>
                        <div className="input-group-prepend">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            -
                          </button>
                        </div>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={e => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="row mt-5">
            <div className="col-md-6">
              <Link to="/" className="btn btn-outline-primary">
                <i className="fas fa-arrow-left mr-2"></i>
                Continue Shopping
              </Link>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping:</span>
                    <span>$5.00</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>${(calculateTotal() + 5).toFixed(2)}</strong>
                  </div>
                  <Link to="/checkout" className="btn btn-primary btn-block">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;