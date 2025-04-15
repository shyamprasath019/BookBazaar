import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Checkout = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit'
  });
  
  const { name, email, address, city, state, zipCode, country, paymentMethod } = formData;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchCart = async () => {
      try {
        const res = await axios.get('/api/cart');
        
        if (res.data.length === 0) {
          navigate('/cart');
          return;
        }
        
        setCartItems(res.data);
        
        // Pre-fill user information if available
        if (user) {
          setFormData(prevState => ({
            ...prevState,
            name: user.name || '',
            email: user.email || ''
          }));
        }
      } catch (err) {
        setError('Error loading cart');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [isAuthenticated, navigate, user]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + 5; // Adding $5 shipping
  };
  
  const placeOrder = async e => {
    e.preventDefault();
    
    setOrderProcessing(true);
    
    try {
      const orderData = {
        shippingAddress: {
          name,
          email,
          address,
          city,
          state,
          zipCode,
          country
        },
        paymentMethod
      };
      
      const res = await axios.post('/api/orders', orderData);
      
      // Redirect to order confirmation page
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError('Error processing order');
      console.error(err);
      setOrderProcessing(false);
    }
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
      <h1 className="mb-4">Checkout</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Shipping Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={placeOrder}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={address}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={city}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={state}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="zipCode">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={zipCode}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={country}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="card mt-4 mb-3">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Payment Method</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="creditCard"
                        value="credit"
                        checked={paymentMethod === 'credit'}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="creditCard">
                        Credit Card
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="paypal"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="paypal">
                        PayPal
                      </label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg mt-3"
                  disabled={orderProcessing}
                >
                  {orderProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="list-group mb-3">
                {cartItems.map(item => (
                  <div key={item._id} className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                      <h6 className="my-0">{item.book.title}</h6>
                      <small className="text-muted">Quantity: {item.quantity}</small>
                    </div>
                    <span className="text-muted">${(item.book.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="list-group-item d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>${calculateTotal().toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;