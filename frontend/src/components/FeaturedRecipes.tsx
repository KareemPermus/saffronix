import Link from 'next/link';
import { Recipe } from '@/types';
import { FiClock } from 'react-icons/fi';
import styles from '@/styles/FeaturedRecipes.module.css';

interface Props {
  recipes: Recipe[];
}

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

export default function FeaturedRecipes({ recipes }: Props) {
  if (recipes.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>Popular this week</h2>
        <p className={styles.empty}>No recipes found. Add your first recipe!</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Popular this week</h2>
        <Link href="/recipes" className={styles.seeAll}>See all →</Link>
      </div>
      <div className={styles.grid}>
        {recipes.slice(0, 8).map((r, i) => (
          <Link href={`/recipes/${r.id}`} key={r.id} className={styles.card}>
            <div
              className={styles.cardImg}
              style={{ backgroundImage: `url(${r.image_url || placeholderImages[i % placeholderImages.length]})` }}
            />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardDesc}>{r.description || 'A delicious recipe'}</p>
              <div className={styles.cardMeta}>
                {(r.prep_time_minutes || r.cook_time_minutes) && (
                  <span className={styles.time}>
                    <FiClock size={14} />
                    {(r.prep_time_minutes || 0) + (r.cook_time_minutes || 0)} min
                  </span>
                )}
                {r.servings && <span className={styles.servings}>{r.servings} servings</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}