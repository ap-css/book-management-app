// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you have or will create a simple App.css for basic styling

// !!! IMPORTANT: Replace this with YOUR DEPLOYED RENDER BACKEND URL !!!
const API_BASE_URL = 'https://book-management-app-e8ld.onrender.com/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', publication_year: '', cover_image: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL);
      setBooks(response.data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingBook) {
        await axios.put(`${API_BASE_URL}/${editingBook.id}`, editingBook);
        setEditingBook(null); // Exit edit mode
      } else {
        await axios.post(API_BASE_URL, newBook);
        setNewBook({ title: '', author: '', publication_year: '', cover_image: '' }); // Clear form
      }
      fetchBooks(); // Refresh book list
    } catch (err) {
      console.error('Error saving book:', err);
      setError('Failed to save book. Please check your input.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setError(null);
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchBooks(); // Refresh book list
      } catch (err) {
        console.error('Error deleting book:', err);
        setError('Failed to delete book.');
      }
    }
  };

  const handleEditClick = (book) => {
    setEditingBook({ ...book }); // Set book data for editing
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const renderBookForm = () => (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={editingBook ? editingBook.title : newBook.title}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={editingBook ? editingBook.author : newBook.author}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="publication_year"
        placeholder="Publication Year"
        value={editingBook ? editingBook.publication_year : newBook.publication_year}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="cover_image"
        placeholder="Cover Image URL (e.g., https://example.com/cover.jpg)"
        value={editingBook ? editingBook.cover_image : newBook.cover_image}
        onChange={handleInputChange}
      />
      <button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</button>
      {editingBook && <button type="button" onClick={() => setEditingBook(null)}>Cancel Edit</button>}
    </form>
  );

  return (
    <div className="app-container">
      <h1>Book Management Application</h1>
      {renderBookForm()}
      <hr />
      <h2>My Books</h2>
      {loading && <p>Loading books...</p>}
      {!loading && error && <p className="error-message">{error}</p>}
      {!loading && !error && books.length === 0 && <p>No books found. Add one above!</p>}
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            {/*Inside your .map for rendering books:*/}
{book.cover_image ? (
  <img src={book.cover_image} alt={`Cover of ${book.title}`} className="book-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/FF0000/FFFFFF?text=Image+Error'; }} />
) : (
  <div className="book-cover placeholder">No Cover Image</div>
)}
            <h3>{book.title}</h3>
            <p>By {book.author}</p>
            {book.publication_year && <p>Year: {book.publication_year}</p>}
            <div className="card-actions">
              <button onClick={() => handleEditClick(book)}>Edit</button>
              <button onClick={() => handleDelete(book.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;