import React, { useState } from 'react';
import {
  LayoutDashboard, ListTodo, Users, Settings, Bell,
  ChevronDown, Circle, Clock, CheckCircle2, AlertCircle,
  CalendarDays, Tag, Search
} from 'lucide-react';

const INITIAL_TASKS = [
  { id: 1, title: 'Set up project repository', assignee: 'Alice', status: 'done', priority: 'high', date: '2025-06-01', labels: ['infra'] },
  { id: 2, title: 'Create database schema', assignee: 'Bob', status: 'done', priority: 'high', date: '2025-06-02', labels: ['backend'] },
  { id: 3, title: 'Build REST API endpoints', assignee: 'Alice', status: 'in-progress', priority: 'high', date: '2025-06-05', labels: ['backend', 'api'] },
  { id: 4, title: 'Write unit tests', assignee: 'Charlie', status: 'in-progress', priority: 'medium', date: '2025-06-06', labels: ['testing'] },
  { id: 5, title: 'Design login page', assignee: 'Bob', status: 'todo', priority: 'medium', date: '2025-06-09', labels: ['frontend', 'design'] },
  { id: 6, title: 'Set up deployment pipeline', assignee: 'Charlie', status: 'todo', priority: 'low', date: '2025-06-10', labels: ['infra', 'devops'] },
  { id: 7, title: 'Add error handling', assignee: 'Alice', status: 'todo', priority: 'medium', date: '2025-06-12', labels: ['backend'] },
  { id: 8, title: 'Implement auth middleware', assignee: 'Alice', status: 'in-progress', priority: 'high', date: '2025-06-07', labels: ['backend', 'security'] },
  { id: 9, title: 'Create user profile page', assignee: 'Bob', status: 'todo', priority: 'low', date: '2025-06-14', labels: ['frontend'] },
  { id: 10, title: 'Set up monitoring & alerts', assignee: 'Charlie', status: 'todo', priority: 'medium', date: '2025-06-15', labels: ['infra', 'devops'] }
];

const MEMBERS = [
  { name: 'Alice', color: 'bg-violet-500' },
  { name: 'Bob', color: 'bg-sky-500' },
  { name: 'Charlie', color: 'bg-amber-500' }
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'Todo' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

const STATUS_CONFIG = {
  'todo': { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100 text-gray-600' },
  'in-progress': { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 text-blue-700' },
  'done': { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 text-green-700' }
};

const PRIORITY_CONFIG = {
  'high': 'bg-red-100 text-red-700',
  'medium': 'bg-yellow-100 text-yellow-700',
  'low': 'bg-gray-100 text-gray-500'
};

const LABEL_COLORS = {
  'frontend': 'bg-purple-100 text-purple-700',
  'backend': 'bg-sky-100 text-sky-700',
  'infra': 'bg-orange-100 text-orange-700',
  'design': 'bg-pink-100 text-pink-700',
  'testing': 'bg-teal-100 text-teal-700',
  'api': 'bg-indigo-100 text-indigo-700',
  'devops': 'bg-amber-100 text-amber-700',
  'security': 'bg-red-100 text-red-600'
};

export function filterTasks(tasks, filter) {
  if (filter === 'all') return tasks;
  return tasks.filter(task => task.status === filter);
}

export function searchTasks(tasks, query) {
  const q = query.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(task =>
    task.title.toLowerCase().includes(q) ||
    task.assignee.toLowerCase().includes(q)
  );
}

export function countTasks(tasks, filter) {
  return filterTasks(tasks, filter).length;
}

function Avatar({ name, color }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-semibold ${color}`}>
      {initials}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <Icon size={15} className={accent} />
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function Sidebar({ active, onNavigate }) {
  const NAV = [
    { key: 'board', label: 'Board', icon: LayoutDashboard },
    { key: 'tasks', label: 'Tasks', icon: ListTodo },
    { key: 'team', label: 'Team', icon: Users },
    { key: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-56 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-200">
        <h1 className="text-sm font-bold text-gray-900 tracking-tight">Sprint Board</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">v1.2.0 — Q2 Sprint</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              active === key
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Avatar name="Divy C" color="bg-gray-800" />
          <div>
            <p className="text-xs font-medium text-gray-800">Divy C</p>
            <p className="text-[10px] text-gray-400">Project Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState('board');

  const visibleTasks = searchTasks(filterTasks(tasks, filter), search);
  const doneCount = countTasks(tasks, 'done');
  const progressPct = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar active={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {page === 'board' ? 'Board Overview' : page === 'tasks' ? 'All Tasks' : page === 'team' ? 'Team' : 'Settings'}
            </h2>
            <p className="text-xs text-gray-400">June 2025 Sprint</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex -space-x-2">
              {MEMBERS.map(m => <Avatar key={m.name} name={m.name} color={m.color} />)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/50">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Tasks" value={tasks.length} sub={`${doneCount} completed`} icon={ListTodo} accent="text-gray-400" />
            <StatCard label="In Progress" value={countTasks(tasks, 'in-progress')} sub="active now" icon={Clock} accent="text-blue-500" />
            <StatCard label="Completion" value={`${progressPct}%`} sub={`${doneCount}/${tasks.length} done`} icon={CheckCircle2} accent="text-green-500" />
            <StatCard label="Blocked" value={0} sub="no blockers" icon={AlertCircle} accent="text-amber-500" />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(({ key, label }) => {
                const isActive = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    aria-pressed={isActive}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                    <span className={`ml-1.5 text-xs ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                      {countTasks(tasks, key)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or assignee"
                  aria-label="Search tasks"
                  className="w-64 text-sm pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                />
              </div>
              <span className="text-xs text-gray-400">{visibleTasks.length} tasks</span>
            </div>
          </div>

          {/* Task table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Task</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Assignee</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Priority</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Labels</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map(task => {
                  const statusCfg = STATUS_CONFIG[task.status];
                  const StatusIcon = statusCfg.icon;
                  const memberColor = MEMBERS.find(m => m.name === task.assignee)?.color || 'bg-gray-400';
                  return (
                    <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} className={statusCfg.color} />
                          <span className="text-gray-900 font-medium">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignee} color={memberColor} />
                          <span className="text-gray-600">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.bg}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_CONFIG[task.priority]}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {task.labels.map(label => (
                            <span key={label} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${LABEL_COLORS[label] || 'bg-gray-100 text-gray-500'}`}>
                              {label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {task.date}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Progress bar */}
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Sprint Progress</span>
              <span className="text-xs text-gray-400">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
