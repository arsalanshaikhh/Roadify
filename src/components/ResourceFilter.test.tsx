import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ResourceFilter from './ResourceFilter';

describe('ResourceFilter', () => {
  it('renders All, Free, and Paid tabs', () => {
    render(<ResourceFilter active="all" onChange={vi.fn()} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('calls onChange with "free" when Free is clicked', async () => {
    const onChange = vi.fn();
    render(<ResourceFilter active="all" onChange={onChange} />);
    await userEvent.click(screen.getByText('Free'));
    expect(onChange).toHaveBeenCalledWith('free');
  });

  it('calls onChange with "paid" when Paid is clicked', async () => {
    const onChange = vi.fn();
    render(<ResourceFilter active="all" onChange={onChange} />);
    await userEvent.click(screen.getByText('Paid'));
    expect(onChange).toHaveBeenCalledWith('paid');
  });

  it('calls onChange with "all" when All is clicked', async () => {
    const onChange = vi.fn();
    render(<ResourceFilter active="free" onChange={onChange} />);
    await userEvent.click(screen.getByText('All'));
    expect(onChange).toHaveBeenCalledWith('all');
  });
});
