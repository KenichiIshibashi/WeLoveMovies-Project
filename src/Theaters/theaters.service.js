const db = require("../db/connection");

// returns all the records from the "theaters" table in the database
function list() {
  return db("theaters");
}

// The getMovies function fetches all movies playing in a specific theater.

function getMovies(theaterId) {
  return db("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ "mt.theater_id": theaterId })
    .select("m.*", "mt.is_showing", "mt.theater_id");
}

module.exports = {
  list,
  getMovies,
};
