import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Recipes from '@/pages/recipes';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));

const mockRecipes = [
  { id: 1, title: 'Pasta Carbonara', description: 'Creamy Italian pasta', prep_time_minutes: 10, cook_time_minutes: 20, servings: 4, image_url: '', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, title: 'Quick Salad', description: 'Fresh greens', prep_time_minutes: 5, cook_time_minutes: 0, servings: 2, image_url: '', created_at: '2024-01-02', updated_at: '2024-01-02' },
];

describe('Recipes page', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('renders recipes from API', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument());
    expect(screen.getByText('Quick Salad')).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Failed to load recipes.')).toBeInTheDocument());
  });

  it('filters by search', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Search recipes…'), { target: { value: 'salad' } });
    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument();
    expect(screen.getByText('Quick Salad')).toBeInTheDocument();
  });

  it('filters under 30 min', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Under 30 min'));
    // Quick Salad is 5 min total, Pasta is 30 min (not under 30)
    expect(screen.queryByText('Pasta Carbonara')).not.toBeInTheDocument();
    expect(screen.getByText('Quick Salad')).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });
    render(<Recipes />);
    await waitFor(() => expect(screen.getByText(/No recipes found/)).toBeInTheDocument());
  });
});