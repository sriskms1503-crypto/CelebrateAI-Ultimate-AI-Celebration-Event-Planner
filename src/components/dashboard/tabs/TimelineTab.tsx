import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  AlertTriangle,
  Trash2,
  Filter,
  Check,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { EventPlan, TaskItem, TaskPriority, TaskStatus } from '../../../types/event';
import { generateAdaptiveMilestones, isPastDate, formatEventDate } from '../../../utils/date';

interface TimelineTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ event, onUpdateEvent }) => {
  const [viewMode, setViewMode] = useState<'board' | 'milestones'>('board');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Add Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskDesc, setTaskDesc] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Medium');
  const [taskDueDate, setTaskDueDate] = useState<string>(event.date);
  const [taskCategory, setTaskCategory] = useState<string>('General');

  const milestones = generateAdaptiveMilestones(event.date, event.eventType);

  const completedCount = event.checklist.filter((t) => t.status === 'Completed').length;
  const progressPct =
    event.checklist.length > 0 ? Math.round((completedCount / event.checklist.length) * 100) : 0;

  const handleToggleTaskStatus = (id: string) => {
    const updated = event.checklist.map((t) => {
      if (t.id === id) {
        const nextStatus: TaskStatus =
          t.status === 'Completed' ? 'Pending' : t.status === 'Pending' ? 'In Progress' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    onUpdateEvent({
      ...event,
      checklist: updated,
    });
  };

  const handleDeleteTask = (id: string) => {
    const updated = event.checklist.filter((t) => t.id !== id);
    onUpdateEvent({
      ...event,
      checklist: updated,
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: taskDesc,
      priority: taskPriority,
      dueDate: taskDueDate,
      category: taskCategory,
      status: 'Pending',
    };

    onUpdateEvent({
      ...event,
      checklist: [newTask, ...event.checklist],
    });

    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const filteredTasks = event.checklist.filter((t) => {
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchCat = filterCategory === 'All' || t.category === filterCategory;
    return matchPriority && matchCat;
  });

  const categories = Array.from(new Set(event.checklist.map((t) => t.category)));

  return (
    <div className="space-y-8">
      {/* Top Banner & Progress */}
      <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Timeline Execution Engine
          </span>
          <h2 className="text-xl font-bold font-editorial text-[#2D1236] mt-0.5">
            Planning Milestones & Task Board
          </h2>
          <p className="text-xs text-[#7A6A7E] mt-1">
            Adapts automatically to lead time before {formatEventDate(event.date)}.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-200 text-right">
            <span className="text-[11px] text-purple-900 font-medium block">Checklist Completion</span>
            <span className="text-lg font-bold font-mono text-[#2D1236]">
              {completedCount} / {event.checklist.length} ({progressPct}%)
            </span>
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#EBE3DA] rounded-xl self-start">
          <button
            onClick={() => setViewMode('board')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'board'
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-[#6C5870] hover:text-[#2D1236]'
            }`}
          >
            Kanban Task Board
          </button>
          <button
            onClick={() => setViewMode('milestones')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewMode === 'milestones'
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-[#6C5870] hover:text-[#2D1236]'
            }`}
          >
            Adaptive Milestones Timeline
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6C5870]">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2 py-1 rounded-lg border border-[#D8C7B9] bg-white font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6C5870]">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 rounded-lg border border-[#D8C7B9] bg-white font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View 1: Kanban Task Board */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['Pending', 'In Progress', 'Completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);

            return (
              <div key={colStatus} className="bg-[#FAF8F5] rounded-2xl border border-[#E2D5C8] p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8DDD2]">
                  <span className="text-xs font-bold text-[#2D1236] uppercase tracking-wide flex items-center gap-1.5">
                    {colStatus === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {colStatus === 'In Progress' && <Layers className="w-3.5 h-3.5 text-purple-600" />}
                    {colStatus === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{colStatus}</span>
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#D8C7B9]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-[11px] text-slate-400">
                      No tasks in {colStatus.toLowerCase()}
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const isOverdue = task.status !== 'Completed' && isPastDate(task.dueDate);

                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-3.5 border border-[#E8DDD2] shadow-xs hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#2D1236] leading-snug">
                              {task.title}
                            </span>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-300 hover:text-rose-500 cursor-pointer p-0.5"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-[#6C5870] mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-medium">
                              {task.category}
                            </span>

                            <span
                              className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {task.priority}
                            </span>

                            <span
                              className={`font-mono ${
                                isOverdue ? 'text-rose-600 font-bold flex items-center gap-1' : 'text-slate-500'
                              }`}
                            >
                              {isOverdue && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                              Due: {task.dueDate}
                            </span>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-dashed border-slate-100 flex justify-end">
                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className="text-[11px] font-semibold text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
                            >
                              <span>
                                Move to {task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Pending'}
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Adaptive Milestones Timeline */}
      {viewMode === 'milestones' && (
        <div className="bg-white rounded-2xl border border-[#E2D5C8] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#E8DDD2] pb-3">
            <h3 className="text-base font-bold font-editorial text-[#2D1236]">
              Milestone Countdown Roadmap
            </h3>
            <p className="text-xs text-[#7A6A7E]">
              Recommended planning sequence automatically calibrated for your event type and target date.
            </p>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-purple-200">
            {milestones.map((m, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-purple-700 border-4 border-white shadow-sm" />
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wide block">
                  {m.phase}
                </span>
                <div className="mt-2 bg-[#FAF8F5] rounded-xl p-4 border border-[#E8DDD2]">
                  <ul className="space-y-1.5 text-xs text-[#2D1236]">
                    {m.tasks.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2D5C8]">
            <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3 mb-4">
              <h3 className="text-base font-bold text-[#2D1236]">Add Planning Task</h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D1236] mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm wedding cake design & flavor tasting"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details, vendor contact, or specific requirements"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2D1236] mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Catering, Venue, Photography"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D1236] mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B9] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DDD2]">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8C7B9] text-[#6C5870] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
