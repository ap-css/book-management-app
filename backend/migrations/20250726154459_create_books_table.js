
exports.up = function(knex) {
  return knex.schema.createTable('books', function(table) {
    table.increments('id').primary(); 
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.integer('publication_year');
    table.timestamps(true, true); 
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('books'); 
};