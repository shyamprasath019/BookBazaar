import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BookItem = ({ book }) => {
  return (
    <div className="card mb-4">
      <img
        src={book.coverImage || 'https://via.placeholder.com/150x200'}
        alt={book.title}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-text">by {book.author}</p>
        <p className="card-text text-primary">${book.price.toFixed(2)}</p>
        <div className="d-flex justify-content-between">
          <Link to={`/books/${book._id}`} className="btn btn-info btn-sm">
            View Details
          </Link>
          <button className="btn btn-primary btn-sm">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

BookItem.propTypes = {
  book: PropTypes.object.isRequired
};

export default BookItem;