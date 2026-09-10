import { Recipe, Ingredient, Step, RecipeDetail, DeleteResponse } from '@/types';

describe('Types', () => {
  it('Recipe interface shape', () => {
    const r: Recipe = { id: 1, title: 'Test', created_at: '', updated_at: '' };
    expect(r.id).toBe(1);
  });

  it('RecipeDetail includes ingredients and steps', () => {
    const rd: RecipeDetail = { id: 1, title: 'T', created_at: '', updated_at: '', ingredients: [], steps: [] };
    expect(rd.ingredients).toEqual([]);
    expect(rd.steps).toEqual([]);
  });

  it('DeleteResponse shape', () => {
    const d: DeleteResponse = { success: true };
    expect(d.success).toBe(true);
  });
});