import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>BookMarket</h5>
            <p>Your one-stop shop for all book needs.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white">Home</Link>
              </li>
              <li>
                <Link to="/books" className="text-white">Browse Books</Link>
              </li>
              <li>
                <Link to="/register" className="text-white">Become a Seller</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: support@bookmarket.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} BookMarket. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;