import TaskItem from './TaskItem'

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function groupLabel(dueDateStr) {
  const today = startOfDay(new Date())
  const due = startOfDay(dueDateStr)
  const diffDays = Math.round((due - today) / 86400000)

  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 7) return 'This Week'
  return 'Later'
}

const GROUP_ORDER = ['Overdue', 'Today', 'Tomorrow', 'This Week', 'Later']

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  emptyTitle,
  emptyHint,
  completedView = false,
}) {
  if (tasks.length === 0 && !completedView) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <circle cx="17" cy="17" r="16" stroke="var(--line)" strokeWidth="2" />
            <path d="M10 17.5l4.5 4.5L24 12" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="empty-state-title">{emptyTitle}</p>
        {emptyHint && <p className="empty-state-hint">{emptyHint}</p>}
      </div>
    )
  }

  if (completedView) {
    return (
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    )
  }

  const groups = GROUP_ORDER.map((label) => ({
    label,
    items: tasks.filter((t) => groupLabel(t.due_date) === label),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="task-groups">
      {groups.map((group) => (
        <section key={group.label} className="task-group">
          <h2 className={`task-group-label ${group.label === 'Overdue' ? 'is-overdue' : ''}`}>
            {group.label}
          </h2>
          <ul className="task-list">
            {group.items.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
