const prisma = require('../prisma'); // Puxa a nossa conexão otimizada com o banco

module.exports = {
  async create(req, res) {
    // 1. Recebe os dados que o Front-end mandou
    const { id_spotify, title, artist, cover_url, release_date } = req.body;
    const userId = req.userId || (req.user && req.user.id) || req.usuarioId; // Capturado pelo seu middleware de autenticação JWT
    
    if (!userId) {
      return res.status(401).json({ error: "Não foi possível identificar o usuário. Verifique se você está logado e se o token é válido." });
    }

    try {
      // 1. Procura se ESTE usuário já tem ESSE álbum salvo
      let album = await prisma.album.findUnique({
        where: {
          id_spotify_userId: { // O Prisma cria esse nome automático para índices compostos
            id_spotify: id_spotify,
            userId: userId
          }
        }
      });

      if (album) {
        return res.status(409).json({ error: "Este álbum já existe na sua biblioteca." });
      } else {
        // 2. Se não tiver, cria vinculado ao usuário logado
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
      }

      return res.status(201).json(album);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar álbum na sua biblioteca." });
    }
  },

  async index(req, res) {
    // Pegamos novamente o ID do usuário que o middleware descobriu
    const userId = req.userId || (req.user && req.user.id) || req.usuarioId;

    if (!userId) {
      return res.status(401).json({ error: "Não foi possível identificar o usuário." });
    }

    try {
      const albums = await prisma.album.findMany({
        where: {
          userId: userId 
        },
        orderBy: {
          created_at: 'desc' // Mostra os adicionados mais recentemente primeiro
        }
      });

      return res.status(200).json(albums);
    } catch (error) {
      console.error("Erro ao listar álbuns:", error);
      return res.status(500).json({ error: "Erro ao buscar a sua biblioteca de álbuns." });
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
