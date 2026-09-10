import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import { Clock, Search, ChefHat, UtensilsCrossed } from 'lucide-react';
import styles from '@/components/recipes/Recipes.module.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Under 30 min'];

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    apiClient.get('/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(() => setError('Failed to load recipes.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = recipes;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    }
    if (category === 'Under 30 min') {
      list = list.filter(r => (r.prep_time_minutes || 0) + (r.cook_time_minutes || 0) < 30);
    }
    return list;
  }, [recipes, search, category]);

  const heroRecipe = recipes.length > 0 ? recipes[0] : null;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} style={{ backgroundImage: heroRecipe?.image_url ? `linear-gradient(90deg,rgba(6,78,59,.92),rgba(6,78,59,.35)),url('${heroRecipe.image_url}')` : undefined }}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Recipe of the day</p>
          <h1 className={styles.heroTitle}>{heroRecipe?.title || 'Discover New Recipes'}</h1>
          <p className={styles.heroDesc}>{heroRecipe?.description || 'Browse your collection of delicious recipes.'}</p>
          {heroRecipe && (
            <Link href={`/recipes/${heroRecipe.id}`} className={styles.heroBtn}>View recipe</Link>
          )}
        </div>
      </section>

      {/* Filter bar */}
      <section className={styles.filterSection}>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} size={16} />
          <input
            placeholder="Search recipes…"
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.categories}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>All Recipes</h2>
          <span className={styles.countBadge}>{filtered.length} recipe{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading && <p className={styles.statusText}>Loading…</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <div className={styles.empty}>
            <UtensilsCrossed size={40} />
            <p>No recipes found. Try a different search or add a new recipe!</p>
          </div>
        )}

        <div className={styles.grid}>
          {filtered.map(r => (
            <Link key={r.id} href={`/recipes/${r.id}`} className={styles.card}>
              <div
                className={styles.cardImg}
                style={{ backgroundImage: r.image_url ? `url('${r.image_url}')` : undefined }}
              >
                {!r.image_url && <ChefHat size={32} className={styles.cardPlaceholderIcon} />}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                {r.description && <p className={styles.cardDesc}>{r.description}</p>}
                <div className={styles.cardMeta}>
                  {(r.prep_time_minutes || r.cook_time_minutes) ? (
                    <span className={styles.metaItem}><Clock size={14} /> {(r.prep_time_minutes || 0) + (r.cook_time_minutes || 0)} min</span>
                  ) : null}
                  {r.servings ? <span className={styles.metaItem}>{r.servings} servings</span> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}