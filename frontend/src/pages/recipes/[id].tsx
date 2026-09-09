import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Recipe, Ingredient, Step } from '@/types';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiUsers, FiTrash2 } from 'react-icons/fi';

interface RecipeDetail extends Recipe {
  ingredients: Ingredient[];
  steps: Step[];
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError('Recipe not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/recipes/${id}`);
      router.push('/recipes');
    } catch {
      setError('Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-stone-400">Loading…</div>;
  if (error || !recipe) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-stone-500">{error || 'Not found'}</p>
      <Link href="/recipes" className="text-emerald-700 hover:underline flex items-center gap-1"><FiArrowLeft /> Back to recipes</Link>
    </div>
  );

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link href="/recipes" className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to recipes
      </Link>

      {recipe.image_url && (
        <div className="rounded-2xl overflow-hidden h-64 mb-6">
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 style={{ fontFamily: "'Fraunces', serif" }} className="text-3xl font-semibold text-stone-800">{recipe.title}</h1>
        <button onClick={handleDelete} disabled={deleting} className="shrink-0 p-2 rounded-lg text-red-600 hover:bg-red-50 transition" title="Delete recipe">
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>

      {recipe.description && <p className="text-stone-500 mb-6">{recipe.description}</p>}

      <div className="flex flex-wrap gap-4 text-sm text-stone-600 mb-8">
        {recipe.prep_time_minutes != null && (
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-lg">
            <FiClock className="w-4 h-4 text-emerald-700" /> Prep {recipe.prep_time_minutes}m
          </span>
        )}
        {recipe.cook_time_minutes != null && (
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-lg">
            <FiClock className="w-4 h-4 text-emerald-700" /> Cook {recipe.cook_time_minutes}m
          </span>
        )}
        {totalTime > 0 && (
          <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 font-medium">
            <FiClock className="w-4 h-4" /> Total {totalTime}m
          </span>
        )}
        {recipe.servings != null && (
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-lg">
            <FiUsers className="w-4 h-4 text-emerald-700" /> {recipe.servings} servings
          </span>
        )}
      </div>

      {recipe.ingredients?.length > 0 && (
        <section className="mb-8">
          <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold mb-4 text-stone-800">Ingredients</h2>
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
            {recipe.ingredients.sort((a, b) => a.order_index - b.order_index).map(ing => (
              <div key={ing.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-stone-700">
                  {ing.quantity && <span className="font-medium">{ing.quantity}</span>}
                  {ing.unit && <span className="text-stone-400 ml-1">{ing.unit}</span>}
                  <span className="ml-1">{ing.name}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {recipe.steps?.length > 0 && (
        <section className="mb-8">
          <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold mb-4 text-stone-800">Steps</h2>
          <div className="space-y-4">
            {recipe.steps.sort((a, b) => a.order_index - b.order_index).map((step, i) => (
              <div key={step.id} className="flex gap-4 bg-white rounded-xl border border-stone-200 p-4">
                <span className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-medium shrink-0">{i + 1}</span>
                <p className="text-sm text-stone-700 leading-relaxed pt-1">{step.instruction}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}