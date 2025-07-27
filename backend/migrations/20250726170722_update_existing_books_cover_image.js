
exports.up = function(knex) {
  
  const defaultCover = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Cover'; 


  return knex('books')
    .update({ cover_image: defaultCover })
    .whereNull('cover_image'); 
};

exports.down = function(knex) {
  
  const defaultCover = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Cover';
  return knex('books')
    .update({ cover_image: null })
    .where('cover_image', defaultCover);
};
