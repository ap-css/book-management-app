// backend/server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development); // Initialize Knex with development config

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies

const BOOKS_TABLE = 'books'; // Define the table name for clarity

// API Endpoint: GET /api/books - Retrieve all books
app.get('/api/books', async (req, res) => {
  try {
    // Select all columns from the 'books' table, including the new 'cover_image'
    const books = await knex(BOOKS_TABLE).select('*');
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to retrieve books', details: error.message });
  }
});

// API Endpoint: POST /api/books - Create a new book
app.post('/api/books', async (req, res) => {
  try {
    // Destructure all expected fields from the request body, including 'cover_image'
    const { title, author, publication_year, cover_image } = req.body;

    // Basic validation for required fields
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required.' });
    }

    // Insert the new book data, including 'cover_image', into the 'books' table
    // .returning('id') is for PostgreSQL to get the ID of the newly inserted row
    const [newBookId] = await knex(BOOKS_TABLE).insert({
      title,
      author,
      publication_year,
      cover_image // Include the new field here
    }).returning('id');

    // Fetch the newly created book by its ID to return the complete record
    const newBook = await knex(BOOKS_TABLE).where({ id: newBookId }).first();
    res.status(201).json(newBook); // 201 Created status
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book', details: error.message });
  }
});

// API Endpoint: PUT /api/books/:id - Update an existing book
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get book ID from URL parameters
    // Destructure all updatable fields from the request body, including 'cover_image'
    const { title, author, publication_year, cover_image } = req.body;

    // Update the book record where ID matches
    const updatedCount = await knex(BOOKS_TABLE)
      .where({ id })
      .update({
        title,
        author,
        publication_year,
        cover_image, // Include the new field here
        updated_at: knex.fn.now() // Update the timestamp
      });

    if (updatedCount) { // If a record was updated (count > 0)
      const updatedBook = await knex(BOOKS_TABLE).where({ id }).first(); // Fetch the updated record
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: 'Book not found' }); // If no book with that ID
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book', details: error.message });
  }
});

// API Endpoint: DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await knex(BOOKS_TABLE).where({ id }).del();
        if (deletedCount) {
            res.status(204).send(); // 204 No Content for successful deletion
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book', details: error.message });
    }
});


// Start the server
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});