const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// middleware to check if movie id provided exists in database.

const _paramsCheck = async (req, res, next) => {
  // Destructuring to extract the movieId property from the req.params object. Short for const movieId = req.params.movieId
  const { movieId } = req.params;

  const match = await service.read(Number(movieId));

  // Check if no movie was found with the given movieId or if movieId is not provided
  if (match.length === 0 || !movieId) {
    return res.status(404).json({
      error: `movieId ${movieId} does not exist in the database`,
    });
  }

  // If a movie match was found, store the movie data in res.locals.
  // The [0] is needed because we're extracting the movie object from the array.
  res.locals.movie = match[0];

  // continue to the next middleware or route handler
  next();
};

async function list(req, res, next) {
  const isShowing = req.query.is_showing === "true";
  const movies = await service.list(isShowing);
  res.json({ data: movies });
}

async function listTheaters(req, res) {
  const movieId = req.params.movieId;
  const theaters = await service.listTheaters(movieId);

  res.status(200).json({ data: theaters });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.movie });
}

//This function will retrieve the reviews + critics info for the movieId that is provided.

async function listReviews(req, res) {
  // Extract movieId from request params.
  const movieId = req.params.movieId;

  // Fetch reviews for the movie now that we know the movieId to fetch. Uses the listReviewsForMovies function in reviews.service.js.
  const reviews = await service.listReviewsForMovie(movieId);

  const formattedReviews = reviews.map((review) => {
    return {
      ...review,
      critic: {
        critic_id: review.critic_id,
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name,
        created_at: review.created_at,
        updated_at: review.updated_at,
      },
    };
  });

  res.json({ data: formattedReviews });
}

module.exports = {
  read: [asyncErrorBoundary(_paramsCheck), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  listTheaters: [
    asyncErrorBoundary(_paramsCheck),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(_paramsCheck),
    asyncErrorBoundary(listReviews),
  ],
};
