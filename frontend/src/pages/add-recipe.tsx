import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '@/api/client';
import { Recipe } from '@/types';
import { Plus, Trash2, Clock, Users, ChefHat, FileText, Image, GripVertical } from 'lucide-react';
import styles from '@/components/add-recipe/AddRecipe.module.css';

interface IngredientInput {
  name: string;
  quantity: string;
  unit: string;
}

interface StepInput {
  instruction: string;
}

export default function AddRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState<IngredientInput[]>([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState<StepInput[]>([{ instruction: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, field: keyof IngredientInput, value: string) => {
    const copy = [...ingredients];
    copy[i] = { ...copy[i], [field]: value };
    setIngredients(copy);
  };

  const addStep = () => setSteps([...steps, { instruction: '' }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, value: string) => {
    const copy = [...steps];
    copy[i] = { instruction: value };
    setSteps(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Recipe title is required'); return; }
    const validIngredients = ingredients.filter(ing => ing.name.trim());
    const validSteps = steps.filter(s => s.instruction.trim());
    if (validIngredients.length === 0) { setError('Add at least one ingredient'); return; }
    if (validSteps.length === 0) { setError('Add at least one step'); return; }

    setSaving(true);
    setError('');
    try {
      const body = {
        title: title.trim(),
        description: description.trim() || undefined,
        prep_time_minutes: prepTime ? parseInt(prepTime) : undefined,
        cook_time_minutes: cookTime ? parseInt(cookTime) : undefined,
        servings: servings ? parseInt(servings) : undefined,
        image_url: imageUrl.trim() || undefined,
        ingredients: validIngredients.map((ing, idx) => ({
          name: ing.name.trim(),
          quantity: ing.quantity.trim() || undefined,
          unit: ing.unit.trim() || undefined,
          order_index: idx,
        })),
        steps: validSteps.map((s, idx) => ({
          instruction: s.instruction.trim(),
          order_index: idx,
        })),
      };
      const res = await apiClient.post('/api/recipes', body);
      router.push(`/recipes/${res.data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>New Recipe</h1>
          <p className={styles.subtitle}>Share your culinary creation with the world</p>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Info Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FileText className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Basic Info</h2>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Recipe Title *</label>
            <input className={styles.input} placeholder="e.g. Miso Mushroom Ramen" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} rows={3} placeholder="A brief description of your recipe…" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className={styles.row3}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Clock size={14} /> Prep (min)</label>
              <input className={styles.input} type="number" min="0" placeholder="15" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Clock size={14} /> Cook (min)</label>
              <input className={styles.input} type="number" min="0" placeholder="30" value={cookTime} onChange={e => setCookTime(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><Users size={14} /> Servings</label>
              <input className={styles.input} type="number" min="1" placeholder="4" value={servings} onChange={e => setServings(e.target.value)} />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}><Image size={14} /> Image URL</label>
            <input className={styles.input} placeholder="https://images.unsplash.com/…" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
        </div>

        {/* Ingredients Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <ChefHat className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Ingredients</h2>
          </div>
          {ingredients.map((ing, i) => (
            <div key={i} className={styles.ingredientRow}>
              <GripVertical size={16} className={styles.grip} />
              <input className={styles.inputSm} placeholder="Quantity" value={ing.quantity} onChange={e => updateIngredient(i, 'quantity', e.target.value)} style={{ width: '80px' }} />
              <input className={styles.inputSm} placeholder="Unit" value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} style={{ width: '80px' }} />
              <input className={styles.inputFlex} placeholder="Ingredient name *" value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} />
              {ingredients.length > 1 && (
                <button type="button" className={styles.removeBtn} onClick={() => removeIngredient(i)}><Trash2 size={16} /></button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addIngredient}>
            <Plus size={16} /> Add Ingredient
          </button>
        </div>

        {/* Steps Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FileText className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Steps</h2>
          </div>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepRow}>
              <span className={styles.stepNum}>{i + 1}</span>
              <textarea className={styles.textareaFlex} rows={2} placeholder="Describe this step…" value={step.instruction} onChange={e => updateStep(i, e.target.value)} />
              {steps.length > 1 && (
                <button type="button" className={styles.removeBtn} onClick={() => removeStep(i)}><Trash2 size={16} /></button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addStep}>
            <Plus size={16} /> Add Step
          </button>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}