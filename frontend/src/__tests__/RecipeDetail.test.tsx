import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeDetailPage from '@/pages/recipes/[id]';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ default: { get: jest.fn(), delete: jest.fn() }, __esModule: true }));
const mockApiClient = apiClient as any;

const mockPush = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ query: { id: '1' }, push: mockPush }) }));

const mockRecipe = {
  id: 1, title: 'Test Recipe', description: 'Desc', prep_time_minutes: 10, cook_time_minutes: 20,
  servings: 4, image_url: 'https://example.com/img.jpg', created_at: '2024-01-01', updated_at: '2024-01-01',
  ingredients: [{ id: 1, name: 'Salt', quantity: '1', unit: 'tsp', order_index: 0 }],
  steps: [{ id: 1, instruction: 'Mix well', order_index: 0 }],
};

test('renders recipe detail', async () => {
  mockApiClient.get.mockResolvedValue({ data: mockRecipe });
  render(<RecipeDetailPage />);
  await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
  expect(screen.getByText('Mix well')).toBeInTheDocument();
  expect(screen.getByText('Salt')).toBeInTheDocument();
});

test('shows error on fetch failure', async () => {
  mockApiClient.get.mockRejectedValue(new Error('fail'));
  render(<RecipeDetailPage />);
  await waitFor(() => expect(screen.getByText('Recipe not found')).toBeInTheDocument());
});

test('delete redirects to recipes', async () => {
  mockApiClient.get.mockResolvedValue({ data: mockRecipe });
  mockApiClient.delete.mockResolvedValue({ data: { success: true } });
  window.confirm = jest.fn(() => true);
  render(<RecipeDetailPage />);
  await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
  await userEvent.click(screen.getByTitle('Delete recipe'));
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/recipes'));
});