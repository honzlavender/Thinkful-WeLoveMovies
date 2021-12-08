const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");


function list() {
    return knex("movies").select("*");
  }

function listNowPlaying() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({"mt.is_showing": true})
}

function read(movieId){
  return knex("movies")
    .select("*")
    .where({ movie_id: movieId })
    .first();
}

function wherePlaying(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*")
    .where({"mt.movie_id": movieId})
}

//VALIDATION FOR MOVIEREVIEW() FUNC USING MAP-PROP.JS
const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

//VALIDATION FUNC FOR MOVIE ID TO MATCH CRITIC ID
function movieReview(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({"r.movie_id": movieId})
    .then((reviewsArray) => reviewsArray.map(addCritic))
}


module.exports = {
    list,
    listNowPlaying,
    read,
    wherePlaying,
    movieReview,
}

/**
 * knex.select(`*`, ).from(`movies as m`).innerJoin(`movies_theaters as mt`, function() { this.on("m.movie_id","=","mt.movie_id")}).where("mt.is_showing","=",knex.raw("?", ['t'::boolean]))
 */