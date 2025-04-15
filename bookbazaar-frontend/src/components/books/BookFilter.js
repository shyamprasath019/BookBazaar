import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BookFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    rating: '',
    inStock: false
  });

  // Categories example - you would fetch these from backend
  const categories = [
    'Fiction',
    'Non-fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Children'
  ];

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClear = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      rating: '',
      inStock: false
    });
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Filter Books</h5>
      </div>
      <div className="card-body">
        <form>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price Range</label>
            <div className="d-flex">
              <input
                type="number"
                className="form-control mr-2"
                placeholder="Min"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Max"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Minimum Rating</label>
            <select
              className="form-control"
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleChange}
            >
              <option value="">Any Rating</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="inStock"
              name="inStock"
              checked={filters.inStock}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="inStock">
              In Stock Only
            </label>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={handleClear}
          >
            Clear Filters
          </button>
        </form>
      </div>
    </div>
  );
};

BookFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired
};

export default BookFilter;