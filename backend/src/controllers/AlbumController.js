const prisma = require('../prisma'); // Puxa a nossa conexão otimizada com o banco

module.exports = {
  async create(req, res) {
    // 1. Agora recebemos também o array de 'tracks' que virá do Front-end
    const { id_spotify, title, artist, cover_url, release_date, tracks } = req.body;
    const userId = req.userId || (req.user && req.user.id) || req.usuarioId; 
    
    if (!userId) {
      return res.status(401).json({ error: "Não foi possível identificar o usuário." });
    }

    try {
      let album = await prisma.album.findUnique({
        where: {
          id_spotify_userId: { 
            id_spotify: id_spotify,
            userId: userId
          }
        }
      });

      if (album) {
        return res.status(409).json({ error: "Este álbum já existe na sua biblioteca." });
      }

      // 2. Cria o Álbum no banco
      album = await prisma.album.create({
        data: {
          id_spotify,
          title,
          artist,
          cover_url,
          userId,
          release_year: release_date ? parseInt(release_date.substring(0, 4)) : null
        }
      });

      // 3. A MÁGICA DAS MÚSICAS: Se o Front-end mandou as músicas, salvamos todas!
      if (tracks && Array.isArray(tracks) && tracks.length > 0) {
        
        // Preparamos o pacote de dados para cada música
        const tracksData = tracks.map(track => ({
          id_spotify: track.id_spotify,
          title: track.title,
          track_number: track.track_number || 1,
          duration: track.duration || 0,
          album_id: album.id,
          userId: userId
        }));

        // Inserção em massa! O skipDuplicates impede o banco de crashar 
        // caso o usuário já tenha salvo uma destas músicas separadamente antes.
        await prisma.track.createMany({
          data: tracksData,
          skipDuplicates: true, 
        });
      }

      return res.status(201).json(album);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar álbum e músicas na sua biblioteca." });
    }
  },

  // backend/src/controllers/AlbumController.js

async index(req, res) {
  const user_id = req.userId || req.usuarioId;

  try {
    // 1. Buscamos os álbuns do utilizador logado
    const userAlbums = await prisma.album.findMany({
      where: { userId: user_id },
      orderBy: { created_at: 'desc' }
    });

    // 2. Para cada álbum, calculamos a média global
    const albumsWithAverage = await Promise.all(userAlbums.map(async (album) => {
      
      // Buscamos todas as reviews que mencionam o ID do Spotify deste álbum
      const allReviews = await prisma.review.findMany({
        where: {
          album: {
            id_spotify: album.id_spotify
          }
        }
      });

      const total = allReviews.length;
      const avg = total > 0 ? allReviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;

      return {
        ...album,
        average: avg
      };
    }));

    return res.json(albumsWithAverage);
  } catch (error) {
    console.error("Erro ao listar álbuns com média:", error);
    return res.status(500).json({ error: "Erro interno ao processar biblioteca." });
  }
},

  async remove(req, res) {
    const userId = req.userId || (req.user && req.user.id) || req.usuarioId;
    const { id_spotify } = req.params; // Pegamos o ID do Spotify que virá na URL

    if (!userId) {
      return res.status(401).json({ error: "Não foi possível identificar o usuário." });
    }

    try {
      // Mandamos o Prisma deletar o álbum cuja combinação (id_spotify + userId) seja esta
      await prisma.album.delete({
        where: {
          id_spotify_userId: {
            id_spotify: id_spotify,
            userId: userId
          }
        }
      });

      return res.status(200).json({ message: "Álbum removido da sua biblioteca." });
    } catch (error) {
      console.error("Erro ao remover álbum:", error);
      return res.status(500).json({ error: "Erro ao remover o álbum ou ele não existe." });
    }
  }
};
