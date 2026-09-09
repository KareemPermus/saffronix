import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import { Clock, Star, ArrowRight, ChefHat } from 'lucide-react';
import styles from '@/components/home/HomePage.module.css';

const categories = ['All', 'Breakfast', 'Salads', 'Pasta', 'One-pot', 'Desserts', 'Under 30 min'];

const heroImages = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=80',
];

const placeholderImages = [
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&q=80',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80',
];

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    apiClient.get('/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = recipes.length > 0 ? recipes[0] : null;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(6,78,59,.92),rgba(6,78,59,.35)),url('${featured?.image_url || heroImages[0]}')`,
        }}
      >
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Recipe of the day</p>
          <h1 className={styles.heroTitle}>
            {featured ? featured.title : 'Charred Broccoli & White Bean Bowl'}
          </h1>
          <p className={styles.heroDesc}>
            {featured?.description || 'Bright lemon-tahini, crispy chickpeas, 25 minutes start to finish.'}
          </p>
          {featured && (
            <Link href={`/recipes/${featured.id}`} className={styles.heroBtn}>
              View recipe
            </Link>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        {categories.map(c => (
          <button
            key={c}
            type="button"
            className={`${styles.catBtn} ${activeCategory === c ? styles.catBtnActive : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </section>

      {/* Recipe grid */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>Popular this week</h2>
          <Link href="/recipes" className={styles.seeAll}>
            See all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading recipes…</p>
        ) : recipes.length === 0 ? (
          <p className={styles.empty}>No recipes yet. <Link href="/add-recipe" className={styles.addLink}>Add your first recipe!</Link></p>
        ) : (
          <div className={styles.grid}>
            {recipes.map((r, i) => (
              <Link key={r.id} href={`/recipes/${r.id}`} className={styles.card}>
                <div
                  className={styles.cardImg}
                  style={{ backgroundImage: `url('${r.image_url || placeholderImages[i % placeholderImages.length]}')` }}
                />
                <div className={styles.cardBody}>
                  <p className={styles.cardCategory}>Recipe</p>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTime}>
                      <Clock size={14} />
                      {(r.prep_time_minutes || 0) + (r.cook_time_minutes || 0)} min
                    </span>
                    <span className={styles.cardServes}>
                      <ChefHat size={14} />
                      {r.servings || '–'} servings
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <span>© 2024 Saffronix</span>
        <span>Made with fresh ingredients & ♥</span>
      </footer>
    </div>
  );
}