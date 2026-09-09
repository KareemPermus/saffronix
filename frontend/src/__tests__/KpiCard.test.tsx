import React from 'react';
import { render, screen } from '@testing-library/react';
import KpiCard from '@/components/dashboard/KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Total" value={42} icon={<span>I</span>} />);
    expect(screen.getByText('Total')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });
});