
exports.seed = async function(knex) {
  
  await knex('books').del();

  
  await knex('books').insert([
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', publication_year: 1954 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', publication_year: 1813 },
    { title: '1984', author: 'George Orwell', publication_year: 1949 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', publication_year: 1960 },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publication_year: 1925 } 
  ]);
};