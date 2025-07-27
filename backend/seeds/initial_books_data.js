// backend/seeds/initial_books_data.js
exports.seed = async function(knex) {
  // Use placehold.co as the new reliable default placeholder
  const defaultCover = 'https://placehold.co/150x150/CCCCCC/FFFFFF?text=No+Cover';

  await knex('books').del(); // Deletes ALL existing entries
  await knex('books').insert([
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', publication_year: 1954, cover_image: defaultCover },
    { title: 'Pride and Prejudice', author: 'Jane Austen', publication_year: 1813, cover_image: defaultCover },
    { title: '1984', author: 'George Orwell', publication_year: 1949, cover_image: defaultCover },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', publication_year: 1960, cover_image: defaultCover },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publication_year: 1925, cover_image: defaultCover }
  ]);
};