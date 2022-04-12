const { Router } = require("express");
const router = Router();

const {
  getVideoGames,
  getGamesById,
  getGenres,
  postNewGame,
  getGameByName,
  deleteGame,
} = require("../controllers/GetGames");



router.get("/getAll", getVideoGames);
router.get("/getGenres", getGenres);
router.get("/:id", getGamesById);
router.get("/", getGameByName);
router.post("/create", postNewGame);

module.exports = router;
