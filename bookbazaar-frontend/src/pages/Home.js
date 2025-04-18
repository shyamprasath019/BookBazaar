import React, { useState, useEffect } from 'react';
import axios from "axios"
import BookItem from '../components/books/BookItem';
import BookFilter from '../components/books/BookFilter';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [featuredBooks, setFeaturedBooks] = useState([]);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/books');
        setBooks(res.data);
        
        // Get featured books (example - top 4 by rating)
        const featured = [...res.data]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setFeaturedBooks(featured);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Apply filters to books
  const filteredBooks = books.filter(book => {
    // Category filter
    if (filters.category && book.category !== filters.category) return false;
    
    // Price filter
    if (filters.priceMin && book.price < parseFloat(filters.priceMin)) return false;
    if (filters.priceMax && book.price > parseFloat(filters.priceMax)) return false;
    
    // Rating filter
    if (filters.rating && book.rating < parseFloat(filters.rating)) return false;
    
    // In stock filter
    if (filters.inStock && !book.inStock) return false;
    
    return true;
  });

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
    <div>
      {/* Hero Section */}
      <div className="jumbotron bg-primary text-white text-center">
        <h1 className="display-4">Welcome to BookMarket</h1>
        <p className="lead">
          Discover thousands of books from independent sellers around the world.
        </p>
        <hr className="my-4" />
        <p>Find your next favorite read or sell your own books!</p>
        <a className="btn btn-light btn-lg" href="#featured" role="button">
          Browse Books
        </a>
      </div>
      
      {/* Featured Books */}
      <section id="featured" className="my-5">
        <h2 className="text-center mb-4">Featured Books</h2>
        <div className="row">
          {featuredBooks.map(book => (
            <div key={book._id} className="col-md-3">
              <BookItem book={book} />
            </div>
          ))}
        </div>
      </section>
      
      {/* Main Book Listing */}
      <section className="my-5">
        <h2 className="text-center mb-4">All Books</h2>
        <div className="row">
          <div className="col-md-3">
            <BookFilter onFilterChange={handleFilterChange} />
          </div>
          <div className="col-md-9">
            <div className="row">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <div key={book._id} className="col-md-4">
                    <BookItem book={book} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>No books found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;