export interface Recipe {
  id: number;
  title: string;
  description?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  servings?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  quantity?: string;
  unit?: string;
  order_index: number;
}

export interface Step {
  id: number;
  recipe_id: number;
  instruction: string;
  order_index: number;
}

export interface RecipeDetail extends Recipe {
  ingredients: Ingredient[];
  steps: Step[];
}

export interface DeleteResponse {
  success: boolean;
}