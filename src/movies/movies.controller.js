const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


//VALIDATING FUNC FOR READ()
async function movieExists(req, res, next) {
  const foundMovie = await moviesService.read(req.params.movieId);
  if(foundMovie){
    res.locals.movie = foundMovie;
    return next()
  }
  next({ status: 404, message: `Movie cannot be found.` })
}

async function list(req, res) {
  const { is_showing } = req.query;
  if(is_showing){
    res.json({ data: await moviesService.listNowPlaying() })
  } else {
    res.json({ data: await moviesService.list() });
  }
}

// FUNC FOR THEATER LIST
async function theaterList(req, res) {
  const { movie_id } = res.locals.movie
 // if(movie_id)
  res.json({ data: await moviesService.wherePlaying(movie_id) })
}

//VALIDATING FUNC FOR REVIEWS
async function reviewList(req, res) {
  const {movie_id} = res.locals.movie
  res.json({ data: await moviesService.movieReview(movie_id)})
}

function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), read],
    listTheaters: [
      asyncErrorBoundary(movieExists),
      asyncErrorBoundary(theaterList)
    ],
    reviewList: [
      asyncErrorBoundary(movieExists),
      asyncErrorBoundary(reviewList)
    ],
}