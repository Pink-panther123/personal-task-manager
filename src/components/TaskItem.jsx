function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T00:00:00`)
  const now = new Date()
  const opts = { month: 'short', day: 'numeric' }
  if (date.getFullYear() !== now.getFullYear()) opts.year = 'numeric'
  return new Intl.DateTimeFormat('en-US', opts).format(date)
}

function isOverdue(task) {
  if (task.completed) return false
  const due = new Date(`${task.due_date}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const overdue = isOverdue(task)

  return (
    <li className={`task-item ${task.completed ? 'is-completed' : ''} ${task._pending ? 'is-pending' : ''}`}>
      <button
        type="button"
        className="task-check"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        onClick={() => onToggle(task)}
        disabled={task._pending}
      >
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
          <path d="M1.5 5.2L4.6 8.3L11.5 1.3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <span className={`task-date ${overdue ? 'is-overdue' : ''}`}>
          {overdue && (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 3v2.8l1.8 1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
          {formatDate(task.due_date)}
        </span>
      </div>

      <button
        type="button"
        className="task-delete"
        aria-label={`Delete "${task.title}"`}
        onClick={() => onDelete(task)}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M2 4h11M5.5 4V2.5h4V4M5.8 7v4M9.2 7v4M3.3 4l.6 8.2a1 1 0 001 .8h5.2a1 1 0 001-.8L11.7 4"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </li>
  )
}
