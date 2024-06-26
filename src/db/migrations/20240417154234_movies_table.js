exports.up = function (knex) {
  return knex.schema.createTable("movies", function (table) {
    table.increments("movie_id").primary();
    table.string("title");
    table.integer("runtime_in_minutes");
    table.string("rating");
    table.text("description");
    table.string("image_url");
    table.timestamps(true, false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("movies");
};
