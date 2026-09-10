INSERT INTO recipes (title, slug, description, prep_time_minutes, cook_time_minutes, servings, image_url)
VALUES ('Classic Spaghetti Carbonara', 'classic-spaghetti-carbonara', 'A traditional Roman pasta dish with eggs, cheese, pancetta, and pepper.', 10, 20, 4, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, prep_time_minutes, cook_time_minutes, servings, image_url)
VALUES ('Thai Green Curry', 'thai-green-curry', 'Aromatic and spicy Thai curry with coconut milk and fresh vegetables.', 15, 25, 3, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipes (title, slug, description, prep_time_minutes, cook_time_minutes, servings, image_url)
VALUES ('Chocolate Lava Cake', 'chocolate-lava-cake', 'Rich and decadent individual chocolate cakes with a molten center.', 20, 14, 2, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index)
SELECT r.id, v.name, v.quantity, v.unit, v.idx FROM recipes r,
(VALUES ('Spaghetti','400','g',0),('Pancetta','200','g',1),('Eggs','4','whole',2),('Pecorino Romano','100','g',3)) AS v(name,quantity,unit,idx)
WHERE r.slug='classic-spaghetti-carbonara'
AND NOT EXISTS (SELECT 1 FROM ingredients WHERE recipe_id=r.id);

INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index)
SELECT r.id, v.name, v.quantity, v.unit, v.idx FROM recipes r,
(VALUES ('Coconut Milk','400','ml',0),('Green Curry Paste','3','tbsp',1),('Chicken Breast','500','g',2),('Thai Basil','1','cup',3)) AS v(name,quantity,unit,idx)
WHERE r.slug='thai-green-curry'
AND NOT EXISTS (SELECT 1 FROM ingredients WHERE recipe_id=r.id);

INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index)
SELECT r.id, v.name, v.quantity, v.unit, v.idx FROM recipes r,
(VALUES ('Dark Chocolate','200','g',0),('Butter','120','g',1),('Eggs','2','whole',2),('Sugar','100','g',3)) AS v(name,quantity,unit,idx)
WHERE r.slug='chocolate-lava-cake'
AND NOT EXISTS (SELECT 1 FROM ingredients WHERE recipe_id=r.id);

INSERT INTO steps (recipe_id, instruction, order_index)
SELECT r.id, v.instruction, v.idx FROM recipes r,
(VALUES ('Boil spaghetti in salted water until al dente.',0),('Cook pancetta until crispy.',1),('Whisk eggs with grated pecorino.',2),('Toss hot pasta with pancetta, then mix in egg mixture off heat.',3)) AS v(instruction,idx)
WHERE r.slug='classic-spaghetti-carbonara'
AND NOT EXISTS (SELECT 1 FROM steps WHERE recipe_id=r.id);

INSERT INTO steps (recipe_id, instruction, order_index)
SELECT r.id, v.instruction, v.idx FROM recipes r,
(VALUES ('Heat oil and fry curry paste until fragrant.',0),('Add coconut milk and bring to a simmer.',1),('Add chicken and cook through.',2),('Garnish with Thai basil and serve with rice.',3)) AS v(instruction,idx)
WHERE r.slug='thai-green-curry'
AND NOT EXISTS (SELECT 1 FROM steps WHERE recipe_id=r.id);

INSERT INTO steps (recipe_id, instruction, order_index)
SELECT r.id, v.instruction, v.idx FROM recipes r,
(VALUES ('Melt chocolate and butter together.',0),('Whisk eggs and sugar, fold into chocolate.',1),('Pour into greased ramekins and bake at 220C for 12-14 minutes.',2)) AS v(instruction,idx)
WHERE r.slug='chocolate-lava-cake'
AND NOT EXISTS (SELECT 1 FROM steps WHERE recipe_id=r.id);