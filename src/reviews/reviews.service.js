const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function read(review_id) {
  return knex("reviews").select("*").where({ review_id: review_id }).first();
}

function update(updateReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updateReview.review_id })
    .update(updateReview);
}

//VALIDATION FUNC TO SUPPORT UPDATED DATA
const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//FUNC TO SUPPORT UPDATE() & RETURN NEW INFO
function freshReview(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.review_id": reviewId })
    .first()
    .then(addCritic);
}

module.exports = {
  read,
  delete: destroy,
  update,
  freshReview,
};
