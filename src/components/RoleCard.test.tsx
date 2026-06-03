import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoleCard from './RoleCard';
import type { Roadmap } from '@/lib/types';

const roadmap: Roadmap = {
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'software',
  description: 'Build interactive UIs for the web',
  nodes: [
    { id: 'html', label: 'HTML', required: true, phase: 'foundation', position: { x: 0, y: 0 } },
    { id: 'js', label: 'JS', required: true, phase: 'core', position: { x: 0, y: 1 } },
  ],
  edges: [],
};

describe('RoleCard', () => {
  it('renders the role title', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    expect(screen.getByText('Build interactive UIs for the web')).toBeInTheDocument();
  });

  it('renders the skill count', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    expect(screen.getByText('2 skills')).toBeInTheDocument();
  });

  it('links to the roadmap page', () => {
    render(<RoleCard roadmap={roadmap} categoryColor="indigo" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/roadmap/frontend-engineer');
  });
});
