import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { filterTasks, countTasks } from './App';

const TASKS = [
  { id: 1, title: 'A', assignee: 'X', status: 'done', date: '2025-06-01' },
  { id: 2, title: 'B', assignee: 'Y', status: 'in-progress', date: '2025-06-02' },
  { id: 3, title: 'C', assignee: 'Z', status: 'todo', date: '2025-06-03' },
  { id: 4, title: 'D', assignee: 'X', status: 'todo', date: '2025-06-04' }
];

describe('filterTasks', () => {
  it('returns all tasks for the "all" filter', () => {
    expect(filterTasks(TASKS, 'all')).toHaveLength(4);
  });

  it('returns only tasks matching the given status', () => {
    expect(filterTasks(TASKS, 'todo').map(t => t.id)).toEqual([3, 4]);
    expect(filterTasks(TASKS, 'in-progress').map(t => t.id)).toEqual([2]);
    expect(filterTasks(TASKS, 'done').map(t => t.id)).toEqual([1]);
  });
});

describe('countTasks', () => {
  it('counts tasks per filter', () => {
    expect(countTasks(TASKS, 'all')).toBe(4);
    expect(countTasks(TASKS, 'todo')).toBe(2);
    expect(countTasks(TASKS, 'in-progress')).toBe(1);
    expect(countTasks(TASKS, 'done')).toBe(1);
  });
});

describe('App filter buttons', () => {
  const getDataRows = () =>
    screen.getAllByRole('row').filter(row => within(row).queryAllByRole('cell').length > 0);

  it('renders four filter buttons with counts', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /All 7/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Todo 3/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /In Progress 2/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Done 2/ })).toBeInTheDocument();
  });

  it('selects "All" by default and shows every task', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /All 7/ })).toHaveAttribute('aria-pressed', 'true');
    expect(getDataRows()).toHaveLength(7);
  });

  it('shows only matching tasks when a status filter is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Todo 3/ }));
    expect(getDataRows()).toHaveLength(3);
    expect(screen.getByRole('button', { name: /Todo 3/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /All 7/ })).toHaveAttribute('aria-pressed', 'false');

    await user.click(screen.getByRole('button', { name: /Done 2/ }));
    expect(getDataRows()).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: /All 7/ }));
    expect(getDataRows()).toHaveLength(7);
  });
});
