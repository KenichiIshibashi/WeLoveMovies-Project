const knew = require("../db/connection");

// Function selects a specific review based off of the Id
function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

// Function deletes a review from the table
function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

// Function gets access to the critic information
function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

// Function adds a critic to the table
async function addCritic(review) {
  review.critic = await readCritic(review.critic_id);

  return review;
}

// Function updates a specific review given the review's id
function update(updatedReview, reviewId) {
  return knex("reviews as r")
    .select("r.*")
    .where({ "read.review_id": reviewId })
    .update(updatedReview, "r.*")
    .then(() => read(reviewId))
    .then(addCritic);
}

module.exports = {
  read,
  delete: destroy,
  update,
};
