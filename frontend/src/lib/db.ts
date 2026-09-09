import path from 'path';

let db: any = null;

export function getDb() {
  if (db) return db;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient } = require('@supabase/supabase-js');
    db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return db;
  }

  const Database = require('better-sqlite3');
  db = new Database(path.join('/tmp', 'app.db'));
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      prep_time_minutes INTEGER,
      cook_time_minutes INTEGER,
      servings INTEGER,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      quantity TEXT,
      unit TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      instruction TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM recipes').get();
  if (count.c === 0) {
    const insertRecipe = db.prepare('INSERT INTO recipes (title, slug, description, prep_time_minutes, cook_time_minutes, servings) VALUES (?,?,?,?,?,?)');
    const insertIngredient = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES (?,?,?,?,?)');
    const insertStep = db.prepare('INSERT INTO steps (recipe_id, instruction, order_index) VALUES (?,?,?)');

    const r1 = insertRecipe.run('Classic Spaghetti Carbonara', 'classic-spaghetti-carbonara', 'A traditional Roman pasta dish with eggs, cheese, pancetta, and pepper.', 10, 20, 4);
    insertIngredient.run(r1.lastInsertRowid, 'Spaghetti', '400', 'g', 0);
    insertIngredient.run(r1.lastInsertRowid, 'Pancetta', '200', 'g', 1);
    insertIngredient.run(r1.lastInsertRowid, 'Eggs', '4', 'whole', 2);
    insertIngredient.run(r1.lastInsertRowid, 'Pecorino Romano', '100', 'g', 3);
    insertStep.run(r1.lastInsertRowid, 'Boil spaghetti in salted water until al dente.', 0);
    insertStep.run(r1.lastInsertRowid, 'Cook pancetta until crispy.', 1);
    insertStep.run(r1.lastInsertRowid, 'Whisk eggs with grated pecorino.', 2);
    insertStep.run(r1.lastInsertRowid, 'Toss hot pasta with pancetta, then mix in egg mixture off heat.', 3);

    const r2 = insertRecipe.run('Thai Green Curry', 'thai-green-curry', 'Aromatic and spicy Thai curry with coconut milk and fresh vegetables.', 15, 25, 3);
    insertIngredient.run(r2.lastInsertRowid, 'Coconut Milk', '400', 'ml', 0);
    insertIngredient.run(r2.lastInsertRowid, 'Green Curry Paste', '3', 'tbsp', 1);
    insertIngredient.run(r2.lastInsertRowid, 'Chicken Breast', '500', 'g', 2);
    insertIngredient.run(r2.lastInsertRowid, 'Thai Basil', '1', 'cup', 3);
    insertStep.run(r2.lastInsertRowid, 'Heat oil and fry curry paste until fragrant.', 0);
    insertStep.run(r2.lastInsertRowid, 'Add coconut milk and bring to a simmer.', 1);
    insertStep.run(r2.lastInsertRowid, 'Add chicken and cook through.', 2);
    insertStep.run(r2.lastInsertRowid, 'Garnish with Thai basil and serve with rice.', 3);

    const r3 = insertRecipe.run('Chocolate Lava Cake', 'chocolate-lava-cake', 'Rich and decadent individual chocolate cakes with a molten center.', 20, 14, 2);
    insertIngredient.run(r3.lastInsertRowid, 'Dark Chocolate', '200', 'g', 0);
    insertIngredient.run(r3.lastInsertRowid, 'Butter', '120', 'g', 1);
    insertIngredient.run(r3.lastInsertRowid, 'Eggs', '2', 'whole', 2);
    insertIngredient.run(r3.lastInsertRowid, 'Sugar', '100', 'g', 3);
    insertStep.run(r3.lastInsertRowid, 'Melt chocolate and butter together.', 0);
    insertStep.run(r3.lastInsertRowid, 'Whisk eggs and sugar, fold into chocolate.', 1);
    insertStep.run(r3.lastInsertRowid, 'Pour into greased ramekins and bake at 220C for 12-14 minutes.', 2);
  }

  return db;
}

export function isSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}