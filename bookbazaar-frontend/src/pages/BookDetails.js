import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
        
        // Fetch reviews for this book
        const reviewsRes = await axios.get(`/api/books/${id}/reviews`);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError('Book not found or error loading book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post('/api/cart', {
        bookId: book._id,
        quantity
      });
      
      navigate('/cart');
    } catch (err) {
      setError('Error adding book to cart');
      console.error(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await axios.post(`/api/books/${id}/reviews`, {
        rating: reviewRating,
        text: reviewText
      });
      
      setReviews([...reviews, res.data]);
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      setError('Error submitting review');
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

  if (error || !book) {
    return (
      <div className="alert alert-danger mt-5" role="alert">
        {error || 'Book not found'}
      </div>
    );
  }

  const isSellerOfBook = user && book.seller && user._id === book.seller._id;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={book.coverImage || 'https://via.placeholder.com/300x400'}
            alt={book.title}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-8">
          <h1>{book.title}</h1>
          <h5>by {book.author}</h5>
          
          <div className="mb-3">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${
                  i < Math.round(book.rating) ? 'text-warning' : 'text-secondary'
                }`}
              ></i>
            ))}
            <span className="ml-2">({book.reviewCount} reviews)</span>
          </div>
          
          <p className="lead text-primary">${book.price.toFixed(2)}</p>
          
          <p>
            <strong>Category:</strong> {book.category}
          </p>
          
          <p>
            <strong>ISBN:</strong> {book.isbn}
          </p>
          
          <p>
            <strong>Publisher:</strong> {book.publisher}
          </p>
          
          <p>
            <strong>Publication Date:</strong>{' '}
            {new Date(book.publicationDate).toLocaleDateString()}
          </p>
          
          <div className="my-4">
            <h4>Description</h4>
            <p>{book.description}</p>
          </div>
          
          {book.inStock ? (
            <div className="d-flex align-items-center mb-4">
              <div className="input-group mr-3" style={{ maxWidth: '150px' }}>
                <div className="input-group-prepend">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                </div>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={book.stockQuantity}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.min(book.stockQuantity, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                className="btn btn-primary"
                onClick={addToCart}
                disabled={isSellerOfBook}
              >
                Add to Cart
              </button>
              
              {isSellerOfBook && (
                <div className="ml-3">
                  <span className="text-muted">You cannot purchase your own book</span>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-warning">
              This book is currently out of stock.
            </div>
          )}
          
          {isSellerOfBook && (
            <div className="mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate(`/seller/books/edit/${book._id}`)}
              >
                Edit Book
              </button>
            </div>
          )}
          
          <div className="seller-info mt-4 p-3 bg-light rounded">
            <h5>Sold by: {book.seller ? book.seller.name : 'BookMarket'}</h5>
            {book.seller && (
              <p className="mb-0">Seller Rating: {book.seller.rating.toFixed(1)}/5</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="row mt-5">
        <div className="col-12">
          <h3>Customer Reviews</h3>
          
          {isAuthenticated && !isSellerOfBook && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Write a Review</h5>
                <form onSubmit={submitReview}>
                  <div className="form-group">
                    <label>Rating</label>
                    <select
                      className="form-control"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Your Review</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{review.user.name}</h5>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < review.rating ? 'text-warning' : 'text-secondary'
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <p className="card-text">{review.text}</p>
                  <small className="text-muted">
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;