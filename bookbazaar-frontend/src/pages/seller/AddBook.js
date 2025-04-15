import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellerAddBook = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    price: '',
    isbn: '',
    publisher: '',
    publicationDate: '',
    stockQuantity: '',
    coverImage: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    title,
    author,
    description,
    category,
    price,
    isbn,
    publisher,
    publicationDate,
    stockQuantity,
    coverImage
  } = formData;
  
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
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const bookData = {
        ...formData,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        inStock: parseInt(stockQuantity) > 0
      };
      
      await axios.post('/api/books', bookData);
      
      navigate('/seller/books');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Add New Book</h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={title}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="author">Author*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="author"
                    name="author"
                    value={author}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description*</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={description}
                    onChange={onChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category*</label>
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    value={category}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="price">Price ($)*</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={price}
                      onChange={onChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="form-group col-md-6">
                    <label htmlFor="stockQuantity">Stock Quantity*</label>
                    <input
                      type="number"
                      className="form-control"
                      id="stockQuantity"
                      name="stockQuantity"
                      value={stockQuantity}
                      onChange={onChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    className="form-control"
                    id="isbn"
                    name="isbn"
                    value={isbn}
                    onChange={onChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                      type="text"
                      className="form-control"
                      id="publisher"
                      name="publisher"
                      value={publisher}
                      onChange={onChange}
                    />
                  </div>
                  
                  <div className="form-group col-md-6">
                    <label htmlFor="publicationDate">Publication Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="publicationDate"
                      name="publicationDate"
                      value={publicationDate}
                      onChange={onChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="coverImage">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="coverImage"
                    name="coverImage"
                    value={coverImage}
                    onChange={onChange}
                    placeholder="https://example.com/book-cover.jpg"
                  />
                  <small className="form-text text-muted">
                    Enter a URL for the book cover image. Leave blank to use a default image.
                  </small>
                </div>
                
                <div className="form-group text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      'Add Book'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/seller/books')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAddBook;