const service = require("./reviews.service");

// Function to delete a specific review
async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

// Function used to target a specific review based off of the reviewId
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  res.status(404).send({ error: "Review cannot be found" });
}

// Fucntion used to update a review
async function update(req, res, next) {
  const updateReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview, res.locals.review.review_id);
  res.json({ data });
}

module.exports = {
  delete: [reviewExists, destroy],
  update: [reviewExists, update],
};
