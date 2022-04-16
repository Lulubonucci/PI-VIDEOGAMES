const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;

const apiCall = async () => {
  const pedido = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}`
  );
  const pedido2 = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=2`
  );
  const pedido3 = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=3`
  );
  const pedido4 = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=4`
  );
  const pedido5 = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=5`
  );

  const games = [
    ...pedido.data.results,
    ...pedido2.data.results,
    ...pedido3.data.results,
    ...pedido4.data.results,
    ...pedido5.data.results,
  ];

  const info = games.map((j) => {
    return {
      id: j.id,
      image: j.background_image,
      name: j.name,
      genres: j.genres,
      rating: j.rating
    };
  });
  return info;
};

const apiCallDescription = async (id) => {
  const apiCall = await axios.get(
    `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
  ); //no se pueda mapear, es obj

  return {
    id: apiCall.data.id,
    image: apiCall.data.background_image,
    name: apiCall.data.name,
    genres: apiCall.data.genres,
    released: apiCall.data.released,
    rating: apiCall.data.rating,
    platforms: apiCall.data.platforms.map((e) => e.platform.name),
    description: apiCall.data.description_raw,
  };
};

const apiCallName = async (name) => {
  try {
    const apiCall = await axios.get(
      `https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
    );
    const result = apiCall.data.results.map((j) => {
      return {
        id: j.id,
        image: j.background_image,
        name: j.name,
        genres: j.genres,
        released: j.released,
        rating: j.rating,
        platforms: j.platforms,
        description: j.description_raw
      };
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  apiCallName,
  apiCall,
  apiCallDescription,
};
