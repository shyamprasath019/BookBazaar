import React from 'react';
import { useParams } from 'react-router-dom';

const EditBook = () => {
  const { id } = useParams();

  return (
    <div className="container mt-5">
      <h2>Edit Book</h2>
      <p>Book ID: {id}</p>
      <p>(To be implemented)</p>
    </div>
  );
};

export default EditBook;
