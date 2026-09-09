import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/', push: jest.fn() }),
}));

import AppLayout from '@/components/layout/AppLayout';

describe('AppLayout', () => {
  it('renders brand name', () => {
    render(<AppLayout><div>content</div></AppLayout>);
    expect(screen.getByText('Saffronix')).toBeTruthy();
  });

  it('renders nav links', () => {
    render(<AppLayout><div>test</div></AppLayout>);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Recipes')).toBeTruthy();
    expect(screen.getByText('Add Recipe')).toBeTruthy();
  });

  it('renders children', () => {
    render(<AppLayout><div>child-content</div></AppLayout>);
    expect(screen.getByText('child-content')).toBeTruthy();
  });
});