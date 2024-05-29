const service = require("./listTheaters.service");
const assyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Function gets the list of theaters
async function list(req, res) {
  res.json({ data: await service.list() });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
