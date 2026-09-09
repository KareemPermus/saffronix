import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import HeroSection from '@/components/HeroSection';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import SearchBar from '@/components/SearchBar';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/api/recipes')
      .then(res => {
        setRecipes(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError('Failed to load recipes'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    if (!q.trim()) {
      setFiltered(recipes);
    } else {
      const lower = q.toLowerCase();
      setFiltered(recipes.filter(r => r.title.toLowerCase().includes(lower) || (r.description || '').toLowerCase().includes(lower)));
    }
  }, [recipes]);

  const featured = recipes.length > 0 ? recipes[0] : null;

  return (
    <div className={styles.page}>
      <HeroSection recipe={featured} />

      <section className={styles.searchSection}>
        <SearchBar value={search} onChange={handleSearch} count={recipes.length} />
      </section>

      {loading && <p className={styles.status}>Loading recipes…</p>}
      {error && <p className={styles.statusError}>{error}</p>}
      {!loading && !error && <FeaturedRecipes recipes={filtered} />}

      <footer className={styles.footer}>
        <span>© 2024 Saffronix</span>
        <span>Made with fresh ingredients & ♥</span>
      </footer>
    </div>
  );
}