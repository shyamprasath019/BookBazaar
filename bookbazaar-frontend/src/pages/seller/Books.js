import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SellerBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/seller/books');
        setBooks(res.data);
      } catch (err) {
        setError('Error fetching books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  const deleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
    } catch (err) {
      setError('Error deleting book');
      console.error(err);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Manage Books</h1>
          <p className="lead">View and manage your book inventory</p>
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
      
      {books.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <i className="fas fa-book fa-3x text-muted mb-3"></i>
          <h3>No Books Found</h3>
          <p>You haven't added any books to your inventory yet.</p>
          <Link to="/seller/books/add" className="btn btn-primary mt-2">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td>
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/40x60'}
                      alt={book.title}
                      style={{ width: '40px', height: '60px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <Link to={`/books/${book._id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>{book.stockQuantity}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        book.inStock ? 'success' : 'danger'
                      }`}
                    >
                      {book.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/seller/books/edit/${book._id}`}
                      className="btn btn-sm btn-primary mr-2"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteBook(book._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerBooks;