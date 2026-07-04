import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from './supabaseClient'
import AddTaskForm from './components/AddTaskForm'
import TaskList from './components/TaskList'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [undoState, setUndoState] = useState(null) // { task, timeoutId }
  const undoTimeoutRef = useRef(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })

    if (error) {
      setErrorMsg('Could not load your tasks. Check your connection and try again.')
      console.error(error)
    } else {
      setErrorMsg(null)
      setTasks(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async ({ title, dueDate }) => {
    const optimistic = {
      id: `temp-${Date.now()}`,
      title,
      due_date: dueDate,
      completed: false,
      created_at: new Date().toISOString(),
      _pending: true,
    }
    setTasks((prev) => [...prev, optimistic])

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, due_date: dueDate, completed: false }])
      .select()
      .single()

    if (error) {
      setErrorMsg('Could not save that task. Please try again.')
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id))
      console.error(error)
      return
    }

    setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? data : t)))
  }

  const toggleComplete = async (task) => {
    const nextCompleted = !task.completed
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    )

    const { error } = await supabase
      .from('tasks')
      .update({ completed: nextCompleted })
      .eq('id', task.id)

    if (error) {
      setErrorMsg('Could not update that task. Please try again.')
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      )
      console.error(error)
    }
  }

  const deleteTask = async (task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id))

    const { error } = await supabase.from('tasks').delete().eq('id', task.id)

    if (error) {
      setErrorMsg('Could not delete that task. Please try again.')
      setTasks((prev) => [...prev, task])
      console.error(error)
      return
    }

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
    undoTimeoutRef.current = setTimeout(() => setUndoState(null), 5000)
    setUndoState({ task })
  }

  const undoDelete = async () => {
    if (!undoState) return
    const { task } = undoState
    clearTimeout(undoTimeoutRef.current)
    setUndoState(null)

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: task.title, due_date: task.due_date, completed: task.completed }])
      .select()
      .single()

    if (!error && data) {
      setTasks((prev) => [...prev, data])
    }
  }

  const incomplete = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  const completed = tasks
    .filter((t) => t.completed)
    .sort((a, b) => new Date(b.due_date) - new Date(a.due_date))

  return (
    <div className="page">
      <div className="wrap">
        <header className="page-header">
          <div className="page-header-mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="5" fill="var(--accent)" />
              <path d="M5.5 10.2l2.8 2.8 5.2-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1>Tasks</h1>
            <p className="page-sub">
              {incomplete.length === 0
                ? 'Nothing outstanding — nice work.'
                : `${incomplete.length} task${incomplete.length === 1 ? '' : 's'} on your plate`}
            </p>
          </div>
        </header>

        <AddTaskForm onAdd={addTask} />

        {errorMsg && (
          <div className="banner banner-error" role="alert">
            {errorMsg}
          </div>
        )}

        <main>
          {loading ? (
            <div className="skeleton-list" aria-hidden="true">
              <div className="skeleton-row" />
              <div className="skeleton-row" />
              <div className="skeleton-row" />
            </div>
          ) : (
            <>
              <TaskList
                tasks={incomplete}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                emptyTitle="You're all caught up"
                emptyHint="Add a task above to get started."
              />

              {completed.length > 0 && (
                <div className="completed-section">
                  <button
                    type="button"
                    className="completed-toggle"
                    onClick={() => setShowCompleted((v) => !v)}
                    aria-expanded={showCompleted}
                  >
                    <svg
                      className={`chevron ${showCompleted ? 'chevron-open' : ''}`}
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Completed ({completed.length})
                  </button>
                  {showCompleted && (
                    <TaskList
                      tasks={completed}
                      onToggle={toggleComplete}
                      onDelete={deleteTask}
                      completedView
                    />
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {undoState && (
        <Toast
          message={`Deleted "${undoState.task.title}"`}
          actionLabel="Undo"
          onAction={undoDelete}
          onDismiss={() => setUndoState(null)}
        />
      )}
    </div>
  )
}

export default App
