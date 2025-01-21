import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: 'http://172.236.225.88', // Cambia por tu host real
  apiKey: 'a39f8477da24b1ae3b9394e646d63fd3caf9bdde8120ef1d90576ba3535d',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { q } = req.query;
  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'El parámetro de búsqueda es requerido' });
  }

  try {
    const index = client.index('movies'); // Asegúrate de que 'movies' sea el índice correcto
    const resultados = await index.search(q, {
      attributesToRetrieve: ['title', 'overview', 'genres', 'poster', 'release_date'],
    });
    res.status(200).json(resultados);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
}
