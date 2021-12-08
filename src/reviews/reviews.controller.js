const reviewsService = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//VALIDATION FOR UPDATE & DESTROY
async function reviewExists(req, res, next) {
    const foundReview = await reviewsService.read(req.params.reviewId);
    if(foundReview){
      res.locals.review = foundReview;
      return next()
    }
    next({ status: 404, message: `Review cannot be found.` })
  }

  async function destroy(req, res, next) {
    await reviewsService.delete(res.locals.review.review_id);
    res.sendStatus(204);
  }

  async function update(req, res, next) {
    const updateReview = {
      ...req.body.data,
      review_id: res.locals.review.review_id,
    };
    await reviewsService.update(updateReview);
    const freshData = await reviewsService.freshReview(res.locals.review.review_id)
    res.json({ data: freshData });
  }


module.exports = {
    delete: [
        asyncErrorBoundary(reviewExists), 
        asyncErrorBoundary(destroy)
    ],
    update: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(update)
    ],
}