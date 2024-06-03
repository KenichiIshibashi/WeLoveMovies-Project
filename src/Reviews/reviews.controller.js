const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.review });
}

async function list(req, res) {
  const reviews = await service.list();
  res.status(200).json({ data: reviews });
}

async function update(req, res) {
  // we're getting the data sent with the request. It checks if the request body contains a property named data. If it does, it uses that; otherwise, it falls back to using the entire request body.
  const requestData = req.body.data || req.body;

  // This line uses destructuring to extract specific properties from requestData.
  const { content, score, critic_id, movie_id } = requestData;

  // creating new constant that holds the new data structure of the updated review.
  const updatedReview = {
    ...res.locals.review,
    content,
    score,
    critic_id,
    movie_id,
  };
  console.log("Review to update:", updatedReview);

  const data = await service.update(req.params.reviewId, updatedReview);

  console.log("Data returned from service.update:", data);

  // Now that the review has been updated, this line fetches the critic associated with the updated review.
  // he getCritic function is called from reviews.service, and it fetches the critic based on the critic_id of the updated review.
  const critic = await service.getCritic(data.critic_id);

  data.critic = critic;

  console.log("data.critic = critic:", data.critic);

  //
  res.json({ data });
}

async function destroy(req, res, next) {
  const deletedRows = await service.remove(res.locals.review.review_id);

  if (deletedRows > 0) {
    return res.sendStatus(204); // The 204 status code indicates that the request was successful, but there's no content to send in the response.
  }
  next({ status: 404, message: "Review cannot be found." });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reviewExists), read],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
