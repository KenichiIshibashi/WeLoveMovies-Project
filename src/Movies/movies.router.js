const router = require("express").Router();
const controller = require("./movies,controller");
const methodNotAllowed = require("../errors/mthodNotAllowed");

router.route("/").get(controller.list).all(methodNotAllowed);

router.route("/:movie").get(contoller.read).all(methodNotAllowed);

router
  .route(":movieId/theaters")
  .get(controller.listTheaters)
  .all(methodNotAllowed);

router
  .route("/:movieId/reviews")
  .get(controller.listReviews)
  .all(methodNotAllowed);

module.exports = router;
