
exports.up = function(knex) {
 
  return knex.schema.table('books', function(table) {
    table.string('cover_image', 255).nullable();
  });
};

exports.down = function(knex) {

  return knex.schema.table('books', function(table) {
    table.dropColumn('cover_image');
  });
};
