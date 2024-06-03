const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

const reduceTheaterMovies = reduceProperties("theater_id", {
  theater_id: ["theater_id"],
  name: ["name"],
  address_line_1: ["address_line_1"],
  address_line_2: ["address_line_2"],
  city: ["city"],
  state: ["state"],
  zip: ["zip"],
  created_at: ["created_at"],
  updated_at: ["updated_at"],
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  is_showing: ["movies", null, "is_showing"],
});

async function list(req, res) {
  const theaters = await service.list();

  const promises = theaters.map((theater) => {
    return service.getMovies(theater.theater_id);
  }); // for each theater in the theaters array, i'm using the getMovies function to get a list of movies playing in that specific theater.

  const theatersMovies = await Promise.all(promises); // Using Promise.all, you ensure that all of the promises in the promises array are resolved before proceeding. This means you're waiting for all the movie lists for each theater to be fetched. The result (theatersMovies) is an array of arrays, where each sub-array contains movies for a specific theater.

  const theatersWithMovies = theaters.map((theater, index) => {
    return { ...theater, movies: theatersMovies[index] };
  }); // the code takes two arrays (theaters and theatersMovies) and merges them into a single array (theatersWithMovies) where each theater is combined with its corresponding list of movies.

  res.json({ data: reduceTheaterMovies(theatersWithMovies) });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
