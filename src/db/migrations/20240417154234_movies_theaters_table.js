exports.up = function (knex) {
  return knex.schema.createTable("movies_theaters", function (table) {
    table.integer("movie_id").unsigned();
    table.foreign("movie_id").references("movie-id").inTable("movies");

    table.integer("theater_id").unsigned();
    table.foreign("theater_id").references("theater_id").inTable("theater");
    table.boolean("is_showing").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("movies_theaters");
};
