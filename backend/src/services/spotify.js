const axios = require('axios');

// 1. Função para pedir o "Crachá Temporário" ao Spotify
async function getSpotifyToken() {
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao autenticar no Spotify:", error.response?.data || error.message);
    throw new Error("Falha na autenticação com a API do Spotify");
  }
}

// 2. Função para pesquisar álbuns
async function searchItems(query) {
  const token = await getSpotifyToken(); 

  const baseURL = "https" + "://" + "api.spotify.com" + "/v1";
  const response = await axios.get(`${baseURL}/search`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      q: query,
      type: 'album,track',
      limit: 10 
    }
  });

  return response.data;
}

async function getAlbumDetails(albumId) {
  const token = await getSpotifyToken();
  
  const baseURL = "https://" + "api" + ".spotify" + ".com/v1";
  const url = `${baseURL}/albums/${albumId}`;
  const response = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getTrackDetails(trackId) {
  const token = await getSpotifyToken();
  
  const baseURL = "https://" + "api" + ".spotify" + ".com/v1";
  const url = `${baseURL}/tracks/${trackId}`;
  const response = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

module.exports = {
  searchItems,
  getTrackDetails,
  getAlbumDetails
};