exports.up = function (knex) {
  return knex.schema.createTable("critics", function (table) {
    table.increments("critic_id").primary();
    table.string("preferred_name");
    table.string("surname");
    table.string("oraganiztion_name");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("critics");
};
