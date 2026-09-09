import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/recipes/index';
import detailHandler from '@/pages/api/recipes/[id]';

// Force SQLite path
delete process.env.NEXT_PUBLIC_SUPABASE_URL;

describe('GET /api/recipes', () => {
  it('returns an array', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(Array.isArray(JSON.parse(res._getData()))).toBe(true);
  });
});

describe('POST /api/recipes', () => {
  it('creates a recipe with ingredients and steps', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Recipe',
        description: 'Desc',
        prep_time_minutes: 5,
        cook_time_minutes: 10,
        servings: 2,
        ingredients: [{ name: 'Salt', quantity: '1', unit: 'tsp' }],
        steps: [{ instruction: 'Add salt' }],
      },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Test Recipe');
    expect(data.ingredients).toHaveLength(1);
    expect(data.steps).toHaveLength(1);
  });

  it('returns 400 without title', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe('GET /api/recipes/[id]', () => {
  it('returns 404 for missing recipe', async () => {
    const { req, res } = createMocks({ method: 'GET', query: { id: '99999' } });
    await detailHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(404);
  });

  it('returns recipe with ingredients and steps', async () => {
    // First create
    const { req: cReq, res: cRes } = createMocks({
      method: 'POST',
      body: { title: 'Detail Test', ingredients: [{ name: 'Pepper' }], steps: [{ instruction: 'Grind' }] },
    });
    await handler(cReq as any, cRes as any);
    const created = JSON.parse(cRes._getData());

    const { req, res } = createMocks({ method: 'GET', query: { id: String(created.id) } });
    await detailHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Detail Test');
    expect(data.ingredients.length).toBeGreaterThanOrEqual(1);
  });
});

describe('PUT /api/recipes/[id]', () => {
  it('updates a recipe', async () => {
    const { req: cReq, res: cRes } = createMocks({
      method: 'POST',
      body: { title: 'Update Test' },
    });
    await handler(cReq as any, cRes as any);
    const created = JSON.parse(cRes._getData());

    const { req, res } = createMocks({
      method: 'PUT',
      query: { id: String(created.id) },
      body: { title: 'Updated Title' },
    });
    await detailHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).title).toBe('Updated Title');
  });
});

describe('DELETE /api/recipes/[id]', () => {
  it('deletes a recipe', async () => {
    const { req: cReq, res: cRes } = createMocks({
      method: 'POST',
      body: { title: 'Delete Test' },
    });
    await handler(cReq as any, cRes as any);
    const created = JSON.parse(cRes._getData());

    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: String(created.id) },
    });
    await detailHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).success).toBe(true);
  });
});

describe('Method not allowed', () => {
  it('returns 405 for PATCH on /api/recipes', async () => {
    const { req, res } = createMocks({ method: 'PATCH' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
  });
});