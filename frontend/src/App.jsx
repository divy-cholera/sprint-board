import React, { useState } from 'react';

const INITIAL_TASKS = [
  { id: 1, title: 'Set up project repository', assignee: 'Alice', status: 'done', date: '2025-06-01' },
  { id: 2, title: 'Create database schema', assignee: 'Bob', status: 'done', date: '2025-06-02' },
  { id: 3, title: 'Build REST API endpoints', assignee: 'Alice', status: 'in-progress', date: '2025-06-05' },
  { id: 4, title: 'Write unit tests', assignee: 'Charlie', status: 'in-progress', date: '2025-06-06' },
  { id: 5, title: 'Design login page', assignee: 'Bob', status: 'todo', date: '2025-06-09' },
  { id: 6, title: 'Set up deployment pipeline', assignee: 'Charlie', status: 'todo', date: '2025-06-10' },
  { id: 7, title: 'Add error handling', assignee: 'Alice', status: 'todo', date: '2025-06-12' }
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'Todo' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

export function filterTasks(tasks, filter) {
  if (filter === 'all') return tasks;
  return tasks.filter(task => task.status === filter);
}

export function countTasks(tasks, filter) {
  return filterTasks(tasks, filter).length;
}

export default function App() {
  const [tasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('all');

  const visibleTasks = filterTasks(tasks, filter);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Task List</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map(({ key, label }) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={isActive}
              className={`text-sm px-3 py-1.5 rounded border transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                {countTasks(tasks, key)}
              </span>
            </button>
          );
        })}
      </div>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="pb-2 font-medium">Task</th>
            <th className="pb-2 font-medium">Assignee</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {visibleTasks.map(task => (
            <tr key={task.id} className="border-b border-gray-100">
              <td className="py-3">{task.title}</td>
              <td className="py-3 text-gray-600">{task.assignee}</td>
              <td className="py-3">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  task.status === 'done' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="py-3 text-gray-500">{task.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
