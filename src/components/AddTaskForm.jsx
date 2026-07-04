import { useState } from 'react'

function todayISO() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(todayISO())
  const [submitting, setSubmitting] = useState(false)
  const [titleError, setTitleError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setTitleError('Give the task a title first.')
      return
    }
    setTitleError(null)
    setSubmitting(true)
    await onAdd({ title: trimmed, dueDate })
    setTitle('')
    setDueDate(todayISO())
    setSubmitting(false)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <div className="add-form-field add-form-title">
        <label htmlFor="task-title" className="sr-only">
          Task title
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError(null)
          }}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? 'task-title-error' : undefined}
        />
      </div>

      <div className="add-form-field add-form-date">
        <label htmlFor="task-date" className="sr-only">
          Due date
        </label>
        <input
          id="task-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>

      {titleError && (
        <p id="task-title-error" className="field-error" role="alert">
          {titleError}
        </p>
      )}
    </form>
  )
}
