const service = require("./movies.service");

// List the movies: Checking for movies that are currently showing, or if not showing displays the movie list.
async function list(req, res, next) {
  const displayed = req.query.is_showing;
  if (displayed) {
    const data = await service.listDisplayed();
    return res.json({ data });
  }
  const data = await service.list();
  res.json({ data });
}

// Function to return the details of a specific movie.
async function read(req, res, next) {
  return res.json({ data: res.locals.movie });
}

// Function to look for a specific movie with the given movieId.
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  res.status(404).send({ error: "Movie cannot be found" });
}

// Function to list theaters showing a specific movie
async function listTheaters(req, res, next) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.listTheaters(movieId);
  res.json({ data });
}

// Function list the reviews for a specific movie
async function listReviews(req, res, next) {
  const movieId = res.locals.movie.movie_id;
  const data = await service.listReviews(movieId);
  res.json({ data });
}

module.exports = {
  list,
  read: [movieExists, read],
  listTheaters: [movieExists, listTheaters],
  listReviews: [movieExists, listReviews],
};
