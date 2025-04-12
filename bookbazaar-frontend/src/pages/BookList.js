import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  TextField, 
  Pagination,
  Button
} from '@mui/material';
import bookService from '../api/books';
import authService from '../api/auth';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    categories: [],
    minPrice: null,
    maxPrice: null,
    condition: ''
  });
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getAllBooks({
          ...searchParams,
          page: page - 1,
          size: 10
        });
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [page, searchParams]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Book Catalog
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Title"
          name="title"
          value={searchParams.title}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Author"
          name="author"
          value={searchParams.author}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Condition"
          name="condition"
          value={searchParams.condition}
          onChange={handleSearchChange}
        />
      </Box>

      {currentUser && (currentUser.accountType === 'SELLER' || currentUser.accountType === 'BOTH') && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/books/new')}
          sx={{ mb: 3 }}
        >
          Add New Book
        </Button>
      )}

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card 
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => navigate(`/books/${book.id}`)}
            >
              {book.coverImages && book.coverImages.length > 0 && (
                <CardMedia
                  component="img"
                  image={book.coverImages[0]}
                  alt={book.title}
                  height="200"
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  by {book.author}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  ${book.price}
                  {book.discount > 0 && (
                    <Typography variant="body2" color="success.main" component="span" sx={{ ml: 1 }}>
                      (Save ${book.discount})
                    </Typography>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default BookList;