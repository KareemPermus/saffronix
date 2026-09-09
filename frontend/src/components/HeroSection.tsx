import Link from 'next/link';
import { Recipe } from '@/types';
import styles from '@/styles/HeroSection.module.css';

interface Props {
  recipe: Recipe | null;
}

export default function HeroSection({ recipe }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <p className={styles.label}>Recipe of the day</p>
        <h1 className={styles.title}>{recipe?.title || 'Discover Amazing Recipes'}</h1>
        <p className={styles.desc}>
          {recipe?.description || 'Browse, create, and organize your favorite recipes.'}
        </p>
        {recipe && (
          <Link href={`/recipes/${recipe.id}`} className={styles.cta}>
            View recipe
          </Link>
        )}
      </div>
    </section>
  );
}