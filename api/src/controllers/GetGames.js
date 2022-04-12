const {
  apiCall,
  apiCallDescription,
  apiCallName,
} = require("../request/ApiCall");
const { Videogame, Genre } = require("../db");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
const { Sequelize } = require("sequelize");

const getVideoGames = async (req, res) => {
  try {
    let videoGames = await apiCall();
    const videoGamesDb = await Videogame.findAll({
      include: {
        model: Genre,
        atributes: ["name"],
        through: { atributes: [] },
      },
    });
    res.send(await Promise.all(videoGamesDb.concat(videoGames)));
  } catch (error) {
    console.log(error);
  }
};

const getGameByName = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(404).json({ msg: "Name is required" });
  else {
    try {
      const apiCall = await apiCallName(name);
      const dataBase = await Videogame.findAll({
        where: {
          name: { [Sequelize.Op.iLike]: `%${name}%` },
        },
        include: {
          model: Genre,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      });
      const allGames = dataBase.concat(apiCall);
      const resultado = allGames.slice(0, 15);
      if (resultado.length > 0) {
        res.send(resultado);
      } else {
        return res.status(404).json({ msg: "The game does not exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const getGamesById = async (req, res) => {
  const { id } = req.params;
  try {
    if (id.length <= 5) {
      const videoGameApi = await apiCallDescription(id);
      res.send(videoGameApi);
    }
    if (id.includes("-")) {
      const videoGameDb = await Videogame.findByPk(id, {
        include: {
          model: Genre,
          attributes: ["name"],
          through: { attributes: [] },
        },
      });
      res.send(videoGameDb);
    } else {
      res.json({ msg: "Game not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getGenres = async (req, res) => {
  try {
    let genresInfo = await axios.get(
      `https://api.rawg.io/api/genres?key=${API_KEY}`
    );
    let genres = genresInfo.data.results.map((j) => {
      return { name: j.name };
    });
    const genresData = await Genre.findAll();

    if (genresData.length > 0) {
      res.send(genresData);
    } else {
      const genresDb = await Genre.bulkCreate(genres);
      res.json({ genresDb });
    }
  } catch (error) {
    res.json({
      msg: "No se encontro",
      error: error,
    });
  }
};

const postNewGame = async (req, res) => {
  let { name, genres, description, released, rating, platforms, createInDb } = req.body;

  if (!name || !description || !released || !rating)
    return res.status(404).json({ msg: "Info are required" });
  else {
    try {
      let newGames = await Videogame.create({
        name,
        description,
        released,
        rating,
        platforms,
        createInDb
      });
      let id_genres = await Genre.findAll({ where: { name: genres } });
      await newGames.addGenre(id_genres);
      res.json({ msg: "VideoGame Created" });
    } catch (error) {
      console.log(error);
    }
  }
};



module.exports = {
  getVideoGames,
  getGameByName,
  getGamesById,
  getGenres,
  postNewGame,
};
