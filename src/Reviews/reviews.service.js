const db = require("../db/connection");

async function list() {
  return db("reviews");
}

async function read(reviewId) {
  return db("reviews").where({ review_id: reviewId }).first();
}

async function update(reviewId, updatedReviewData) {
  await db("reviews")
    // We want to target the review record with the matching reviewId
    .where({ review_id: reviewId })

    // tells the database to update the selected review record with the new values provided in updatedReviewData.
    .update(updatedReviewData);

  const updatedReview = await db("reviews")
    .where({ review_id: reviewId })
    .first();

  return updatedReview;
}

// In summary, the getCritic function facilitates the retrieval of critic details based on a given criticId,
async function getCritic(criticId) {
  return db("critics").where({ critic_id: criticId }).first();
}

// service function to delete a review based on the reviewId that comes in.
async function remove(reviewId) {
  return db("reviews")
    .where({ review_id: reviewId })

    .del();
}

module.exports = {
  list,
  read,
  update,
  getCritic,
  remove,
};
