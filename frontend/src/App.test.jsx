import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { filterTasks, countTasks, searchTasks, sortTasks } from './App';

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

describe('searchTasks', () => {
  it('returns all tasks for an empty or whitespace query', () => {
    expect(searchTasks(TASKS, '')).toHaveLength(4);
    expect(searchTasks(TASKS, '   ')).toHaveLength(4);
  });

  it('matches against the task title (case-insensitive)', () => {
    expect(searchTasks(TASKS, 'a').map(t => t.id)).toEqual([1]);
  });

  it('matches against the assignee (case-insensitive)', () => {
    expect(searchTasks(TASKS, 'x').map(t => t.id)).toEqual([1, 4]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(searchTasks(TASKS, 'zzz')).toEqual([]);
  });
});

describe('App filter buttons', () => {
  const getDataRows = () =>
    screen.getAllByRole('row').filter(row => within(row).queryAllByRole('cell').length > 0);

  it('renders four filter buttons with counts', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /All 10/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Todo 5/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /In Progress 3/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Done 2/ })).toBeInTheDocument();
  });

  it('selects "All" by default and shows every task', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /All 10/ })).toHaveAttribute('aria-pressed', 'true');
    expect(getDataRows()).toHaveLength(10);
  });

  it('shows only matching tasks when a status filter is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Todo 5/ }));
    expect(getDataRows()).toHaveLength(5);
    expect(screen.getByRole('button', { name: /Todo 5/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /All 10/ })).toHaveAttribute('aria-pressed', 'false');

    await user.click(screen.getByRole('button', { name: /Done 2/ }));
    expect(getDataRows()).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: /All 10/ }));
    expect(getDataRows()).toHaveLength(10);
  });
});

describe('App search box', () => {
  const getDataRows = () =>
    screen.getAllByRole('row').filter(row => within(row).queryAllByRole('cell').length > 0);

  it('filters the task list in real-time by title', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /search tasks/i }), 'login');
    const rows = getDataRows();
    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText('Design login page')).toBeInTheDocument();
  });

  it('matches against the assignee name (case-insensitive)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /search tasks/i }), 'CHARLIE');
    expect(getDataRows()).toHaveLength(3);
  });

  it('shows all tasks again when the input is cleared', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('textbox', { name: /search tasks/i });

    await user.type(input, 'login');
    expect(getDataRows()).toHaveLength(1);

    await user.clear(input);
    expect(getDataRows()).toHaveLength(10);
  });

  it('combines search with the active status filter', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Todo 5/ }));
    await user.type(screen.getByRole('textbox', { name: /search tasks/i }), 'alice');
    const rows = getDataRows();
    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText('Add error handling')).toBeInTheDocument();
  });
});

describe('sortTasks', () => {
  it('returns the tasks unchanged when no sort key is given', () => {
    expect(sortTasks(TASKS, null).map(t => t.id)).toEqual([1, 2, 3, 4]);
  });

  it('sorts ascending by the given key', () => {
    expect(sortTasks(TASKS, 'assignee', 'asc').map(t => t.id)).toEqual([1, 4, 2, 3]);
  });

  it('sorts descending by the given key', () => {
    expect(sortTasks(TASKS, 'assignee', 'desc').map(t => t.id)).toEqual([3, 2, 1, 4]);
  });

  it('sorts by date ascending', () => {
    expect(sortTasks(TASKS, 'date', 'asc').map(t => t.id)).toEqual([1, 2, 3, 4]);
  });

  it('does not mutate the original array', () => {
    const original = [...TASKS];
    sortTasks(TASKS, 'title', 'desc');
    expect(TASKS).toEqual(original);
  });
});

describe('App sortable headers', () => {
  const getDataRows = () =>
    screen.getAllByRole('row').filter(row => within(row).queryAllByRole('cell').length > 0);

  const firstTitles = () =>
    getDataRows().map(row => within(row).getAllByRole('cell')[0].textContent.trim());

  it('defaults to sorting by date ascending', () => {
    render(<App />);
    const titles = firstTitles();
    expect(titles[0]).toBe('Set up project repository');
    expect(titles[titles.length - 1]).toBe('Set up monitoring & alerts');
    expect(screen.getByRole('columnheader', { name: /Date/ })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorts ascending by Task title when the Task header is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^Task$/ }));
    const titles = firstTitles();
    expect(titles[0]).toBe('Add error handling');
    expect(screen.getByRole('columnheader', { name: /Task/ })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('toggles to descending when the same header is clicked again', async () => {
    const user = userEvent.setup();
    render(<App />);

    const taskHeaderButton = screen.getByRole('button', { name: /^Task$/ });
    await user.click(taskHeaderButton);
    await user.click(taskHeaderButton);

    const titles = firstTitles();
    expect(titles[0]).toBe('Write unit tests');
    expect(screen.getByRole('columnheader', { name: /Task/ })).toHaveAttribute('aria-sort', 'descending');
  });

  it('resets to ascending when switching to a different column', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^Task$/ }));
    await user.click(screen.getByRole('button', { name: /^Task$/ }));
    await user.click(screen.getByRole('button', { name: /Assignee/ }));

    expect(screen.getByRole('columnheader', { name: /Assignee/ })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('columnheader', { name: /Task/ })).toHaveAttribute('aria-sort', 'none');
  });
});
