import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb, isSupabase } from '@/lib/db';

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    const { search } = req.query;
    try {
      if (isSupabase()) {
        let q = db.from('recipes').select('*').order('created_at', { ascending: false });
        if (search) q = q.ilike('title', `%${search}%`);
        const { data, error } = await q;
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      } else {
        let rows;
        if (search) {
          rows = db.prepare('SELECT * FROM recipes WHERE title LIKE ? ORDER BY created_at DESC').all(`%${search}%`);
        } else {
          rows = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all();
        }
        return res.json(rows);
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { title, description, prep_time_minutes, cook_time_minutes, servings, image_url, ingredients, steps } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const slug = slugify(title) + '-' + Date.now();

    try {
      if (isSupabase()) {
        const { data: recipe, error } = await db.from('recipes').insert({
          title, slug, description: description || null,
          prep_time_minutes: prep_time_minutes || null,
          cook_time_minutes: cook_time_minutes || null,
          servings: servings || null,
          image_url: image_url || null,
        }).select().single();
        if (error) return res.status(500).json({ error: error.message });

        let ings: any[] = [];
        if (ingredients?.length) {
          const { data, error: ie } = await db.from('ingredients').insert(
            ingredients.map((i: any, idx: number) => ({ recipe_id: recipe.id, name: i.name, quantity: i.quantity || null, unit: i.unit || null, order_index: i.order_index ?? idx }))
          ).select();
          if (!ie) ings = data || [];
        }
        let stps: any[] = [];
        if (steps?.length) {
          const { data, error: se } = await db.from('steps').insert(
            steps.map((s: any, idx: number) => ({ recipe_id: recipe.id, instruction: s.instruction, order_index: s.order_index ?? idx }))
          ).select();
          if (!se) stps = data || [];
        }
        return res.status(201).json({ ...recipe, ingredients: ings, steps: stps });
      } else {
        const result = db.prepare('INSERT INTO recipes (title, slug, description, prep_time_minutes, cook_time_minutes, servings, image_url) VALUES (?,?,?,?,?,?,?)').run(
          title, slug, description || null, prep_time_minutes || null, cook_time_minutes || null, servings || null, image_url || null
        );
        const recipeId = result.lastInsertRowid;
        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(recipeId);

        const ings: any[] = [];
        if (ingredients?.length) {
          const stmt = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES (?,?,?,?,?)');
          for (let i = 0; i < ingredients.length; i++) {
            const ing = ingredients[i];
            const r = stmt.run(recipeId, ing.name, ing.quantity || null, ing.unit || null, ing.order_index ?? i);
            ings.push({ id: Number(r.lastInsertRowid), recipe_id: Number(recipeId), name: ing.name, quantity: ing.quantity || null, unit: ing.unit || null, order_index: ing.order_index ?? i });
          }
        }
        const stps: any[] = [];
        if (steps?.length) {
          const stmt = db.prepare('INSERT INTO steps (recipe_id, instruction, order_index) VALUES (?,?,?)');
          for (let i = 0; i < steps.length; i++) {
            const s = steps[i];
            const r = stmt.run(recipeId, s.instruction, s.order_index ?? i);
            stps.push({ id: Number(r.lastInsertRowid), recipe_id: Number(recipeId), instruction: s.instruction, order_index: s.order_index ?? i });
          }
        }
        return res.status(201).json({ ...recipe, id: Number(recipe.id), ingredients: ings, steps: stps });
      }
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}