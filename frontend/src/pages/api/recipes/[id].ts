import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    try {
      if (isSupabase()) {
        const { data: recipe, error } = await db.from('recipes').select('*').eq('id', id).single();
        if (error || !recipe) return res.status(404).json({ error: 'Not found' });
        const { data: ingredients } = await db.from('ingredients').select('*').eq('recipe_id', id).order('order_index');
        const { data: steps } = await db.from('steps').select('*').eq('recipe_id', id).order('order_index');
        return res.json({ ...recipe, ingredients: ingredients || [], steps: steps || [] });
      } else {
        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        if (!recipe) return res.status(404).json({ error: 'Not found' });
        const ingredients = db.prepare('SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY order_index').all(id);
        const steps = db.prepare('SELECT * FROM steps WHERE recipe_id = ? ORDER BY order_index').all(id);
        return res.json({ ...recipe, id: Number(recipe.id), ingredients: ingredients.map((i: any) => ({ ...i, id: Number(i.id), recipe_id: Number(i.recipe_id) })), steps: steps.map((s: any) => ({ ...s, id: Number(s.id), recipe_id: Number(s.recipe_id) })) });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PUT') {
    const { title, description, prep_time_minutes, cook_time_minutes, servings, image_url, ingredients, steps } = req.body;
    try {
      if (isSupabase()) {
        const updates: any = { updated_at: new Date().toISOString() };
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (prep_time_minutes !== undefined) updates.prep_time_minutes = prep_time_minutes;
        if (cook_time_minutes !== undefined) updates.cook_time_minutes = cook_time_minutes;
        if (servings !== undefined) updates.servings = servings;
        if (image_url !== undefined) updates.image_url = image_url;

        const { data: recipe, error } = await db.from('recipes').update(updates).eq('id', id).select().single();
        if (error || !recipe) return res.status(404).json({ error: 'Not found' });

        if (ingredients) {
          await db.from('ingredients').delete().eq('recipe_id', id);
          if (ingredients.length) {
            await db.from('ingredients').insert(ingredients.map((i: any, idx: number) => ({ recipe_id: id, name: i.name, quantity: i.quantity || null, unit: i.unit || null, order_index: i.order_index ?? idx })));
          }
        }
        if (steps) {
          await db.from('steps').delete().eq('recipe_id', id);
          if (steps.length) {
            await db.from('steps').insert(steps.map((s: any, idx: number) => ({ recipe_id: id, instruction: s.instruction, order_index: s.order_index ?? idx })));
          }
        }
        const { data: ings } = await db.from('ingredients').select('*').eq('recipe_id', id).order('order_index');
        const { data: stps } = await db.from('steps').select('*').eq('recipe_id', id).order('order_index');
        return res.json({ ...recipe, ingredients: ings || [], steps: stps || [] });
      } else {
        const existing = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        if (!existing) return res.status(404).json({ error: 'Not found' });

        db.prepare('UPDATE recipes SET title=?, description=?, prep_time_minutes=?, cook_time_minutes=?, servings=?, image_url=?, updated_at=datetime(\'now\') WHERE id=?').run(
          title ?? existing.title, description ?? existing.description, prep_time_minutes ?? existing.prep_time_minutes, cook_time_minutes ?? existing.cook_time_minutes, servings ?? existing.servings, image_url ?? existing.image_url, id
        );

        if (ingredients) {
          db.prepare('DELETE FROM ingredients WHERE recipe_id = ?').run(id);
          const stmt = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES (?,?,?,?,?)');
          for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];
            stmt.run(id, ing.name, ing.quantity || null, ing.unit || null, ing.order_index ?? i);
          }
        }
        if (steps) {
          db.prepare('DELETE FROM steps WHERE recipe_id = ?').run(id);
          const stmt = db.prepare('INSERT INTO steps (recipe_id, instruction, order_index) VALUES (?,?,?)');
          for (let i = 0; i < steps.length; i++) {
            const s = steps[i];
            stmt.run(id, s.instruction, s.order_index ?? i);
          }
        }

        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
        const ings = db.prepare('SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY order_index').all(id);
        const stps = db.prepare('SELECT * FROM steps WHERE recipe_id = ? ORDER BY order_index').all(id);
        return res.json({ ...recipe, id: Number(recipe.id), ingredients: ings.map((i: any) => ({ ...i, id: Number(i.id), recipe_id: Number(i.recipe_id) })), steps: stps.map((s: any) => ({ ...s, id: Number(s.id), recipe_id: Number(s.recipe_id) })) });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (isSupabase()) {
        await db.from('ingredients').delete().eq('recipe_id', id);
        await db.from('steps').delete().eq('recipe_id', id);
        const { error } = await db.from('recipes').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.json({ success: true });
      } else {
        db.prepare('DELETE FROM ingredients WHERE recipe_id = ?').run(id);
        db.prepare('DELETE FROM steps WHERE recipe_id = ?').run(id);
        db.prepare('DELETE FROM recipes WHERE id = ?').run(id);
        return res.json({ success: true });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}