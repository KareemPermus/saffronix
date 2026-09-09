import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '@/pages/index';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockRecipes = [
  { id: 1, title: 'Test Recipe', description: 'Tasty', prep_time_minutes: 10, cook_time_minutes: 20, servings: 4, image_url: '', created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 2, title: 'Another Recipe', description: 'Yum', prep_time_minutes: 5, cook_time_minutes: 15, servings: 2, image_url: '', created_at: '2024-01-01', updated_at: '2024-01-01' },
];

describe('Home page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders recipes after loading', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
    render(<Home />);
    await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
    expect(screen.getByText('Another Recipe')).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Home />);
    await waitFor(() => expect(screen.getByText('Failed to load recipes')).toBeInTheDocument());
  });

  it('filters recipes on search', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockRecipes });
    render(<Home />);
    await waitFor(() => expect(screen.getByText('Test Recipe')).toBeInTheDocument());
    const input = screen.getByPlaceholderText(/Search/);
    fireEvent.change(input, { target: { value: 'Another' } });
    expect(screen.queryByText('Test Recipe')).not.toBeInTheDocument();
    expect(screen.getByText('Another Recipe')).toBeInTheDocument();
  });
});