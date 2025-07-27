
require('dotenv').config({ path: './.env' }); 
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development); 

knex.raw('SELECT 1+1 AS solution') 
  .then((result) => {
    console.log('Database connection successful! Solution:', result.rows[0].solution);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    console.error('Error details:', error.message); 
  })
  .finally(() => {
    knex.destroy(); 
  });