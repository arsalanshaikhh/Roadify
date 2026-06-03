import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResourceCard from './ResourceCard';
import type { Resource } from '@/lib/types';

const freeResource: Resource = {
  title: 'React Docs',
  url: 'https://react.dev',
  type: 'docs',
  free: true,
};

const paidResource: Resource = {
  title: 'Epic React',
  url: 'https://epicreact.dev',
  type: 'course',
  free: false,
};

describe('ResourceCard', () => {
  it('renders the resource title', () => {
    render(<ResourceCard resource={freeResource} />);
    expect(screen.getByText('React Docs')).toBeInTheDocument();
  });

  it('shows Free badge for free resources', () => {
    render(<ResourceCard resource={freeResource} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows Paid badge for paid resources', () => {
    render(<ResourceCard resource={paidResource} />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('links to the resource URL', () => {
    render(<ResourceCard resource={freeResource} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://react.dev');
  });

  it('opens link in new tab', () => {
    render(<ResourceCard resource={freeResource} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
