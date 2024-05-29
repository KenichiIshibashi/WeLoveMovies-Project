const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// Function selects all of the movies in the movies table
function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

// Function returns a list of movies that are currently showing in the theaters
function isShowing() {
  return (
    knex("movies as m")
      // Joins the movies table with the movies_theaters table on movie_id
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .distinct(
        "mt.movie_id",
        "m.title",
        "m.runtime_in_minutes",
        "m.rating",
        "m.description",
        "m.image_url"
      )
      .where({ "mt.is_showing": true })
  );
}

// Uses the mapProperties to next critic properties in a critic object
const addCritic = mapProperties({
  critic_id: "critic,critic_id",
  preffered_name: "critic.preffered_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// Function returns a list of theaters that show a specific movie based on the given movieId
function readTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({ movie_id: movieId, is_showing: true });
}

// Function returns a list of reviews for a specific movie, including the critic information
function readReviews(movieId) {
  return (
    knex("reviews as r")
      // Joins the reviews table with the critics table on critic_id
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("*")
      .where({ movie_id: movieId })
      .then((result) => {
        const returnList = [];
        result.forEach((item) => {
          const itemWithCritic = addCritic(item);
          returnList.push(itemWithCritic);
        });
        return returnList;
      })
  );
}

module.exports = {
  list,
  isShowing,
  read,
  readTheaters,
  readReviews,
};
