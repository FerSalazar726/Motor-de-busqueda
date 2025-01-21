import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css'; // Importamos los estilos CSS

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error en la búsqueda');

        const data = await response.json();
        setResults(data.hits || []);
      } catch (error) {
        setError('Hubo un problema al realizar la búsqueda.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500); // Espera 500ms antes de ejecutar la búsqueda

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className={styles.container}>
      <h1>Cine Verso</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="¿Qué veremos hoy?"
        className={styles.input}
      />

      {loading && <p className={styles.loading}>Buscando...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className={styles.card}>
              <img src={result.poster} alt={result.title} className={styles.image} />
              <h2>{result.title}</h2>
              <p><strong>Género:</strong> {result.genres.join(', ')}</p>
              <p><strong>Fecha de estreno:</strong> {new Date(result.release_date * 1000).toLocaleDateString()}</p>
              <p>{result.overview}</p>
            </div>
          ))
        ) : (
          !loading && query && <p className={styles.noResults}>Ups! No hay resultados...</p>
        )}
      </div>
    </div>
  );
}
