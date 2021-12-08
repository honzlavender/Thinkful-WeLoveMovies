const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");


const movieInfo = reduceProperties("theater_id",{
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    rating: ["movies", null, "rating"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    is_showing: ["movies", null, "is_showing"],
})


//const movieInfo = reduceProperties("theater_id", "movie_id")
//this doesn't work because we need to create a movie_id object 
//nested in the theater_id object in an array

function list() {
    return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("*")
    .then(movieInfo)
}

module.exports = {
    list,
}