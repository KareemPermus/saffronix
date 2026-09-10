import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddRecipe from '@/pages/add-recipe';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

describe('AddRecipe page', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('renders form fields', () => {
    render(<AddRecipe />);
    expect(screen.getByText('New Recipe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Miso Mushroom Ramen')).toBeInTheDocument();
    expect(screen.getByText('Save Recipe')).toBeInTheDocument();
  });

  it('shows error when title is empty on submit', async () => {
    render(<AddRecipe />);
    fireEvent.click(screen.getByText('Save Recipe'));
    expect(screen.getByText('Recipe title is required')).toBeInTheDocument();
  });

  it('shows error when no ingredients', () => {
    render(<AddRecipe />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Miso Mushroom Ramen'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Save Recipe'));
    expect(screen.getByText('Add at least one ingredient')).toBeInTheDocument();
  });

  it('submits and redirects on success', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { id: 42, title: 'Test', created_at: '', updated_at: '', ingredients: [], steps: [] },
    });
    render(<AddRecipe />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Miso Mushroom Ramen'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingredient name *'), { target: { value: 'Salt' } });
    fireEvent.change(screen.getByPlaceholderText('Describe this step…'), { target: { value: 'Mix it' } });
    fireEvent.click(screen.getByText('Save Recipe'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/recipes/42'));
  });

  it('adds and removes ingredient rows', () => {
    render(<AddRecipe />);
    fireEvent.click(screen.getByText('Add Ingredient'));
    const inputs = screen.getAllByPlaceholderText('Ingredient name *');
    expect(inputs).toHaveLength(2);
  });
});