import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const today = formatDate(new Date());

type Task = {
  id: number;
  title: string;
  date: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"today" | "pending" | "overdue">("today");
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks
  useEffect(() => {
    axios
      .get(`${API}/tasks`)
      .then((res) => {
        const formattedTasks = res.data.map((t: any) => ({
          ...t,
          date: formatDate(t.date),
          completed: Boolean(t.completed),
        }));
        setTasks(formattedTasks);
      })
      .catch((err) => console.log(err));
  }, []);

  const priorityColor = {
    high: "#ff2d95",
    medium: "#00f0ff",
    low: "#39ff14",
  };

  // Toggle complete
  const toggleComplete = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const updated = { ...task, completed: !task.completed };
      await axios.put(`${API}/tasks/${id}`, updated);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API}/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Add task
  const addTask = async (title: string, date: string, priority: "low" | "medium" | "high") => {
    try {
      const res = await axios.post(`${API}/tasks`, { title, date, priority });
      const newTask = res.data;
      setTasks((prev) => [...prev, { ...newTask, completed: Boolean(newTask.completed) }]);
      setActiveTab(newTask.date === today ? "today" : "pending");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save task!");
    }
  };

  const getFilteredTasks = () => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pendingTasks = sortedTasks.filter((t) => !t.completed);
    const completedTasks = sortedTasks.filter((t) => t.completed);

    let filtered: Task[] = [];
    switch (activeTab) {
      case "today":
        filtered = pendingTasks.filter((t) => t.date === today);
        break;
      case "pending":
        filtered = pendingTasks.filter((t) => t.date >= today);
        break;
      case "overdue":
        filtered = pendingTasks.filter((t) => t.date < today);
        break;
    }

    const getTabCount = (tab: "today" | "pending" | "overdue") => {
      if (tab === "today") return pendingTasks.filter((t) => t.date === today).length;
      if (tab === "pending") return pendingTasks.filter((t) => t.date >= today).length;
      if (tab === "overdue") return pendingTasks.filter((t) => t.date < today).length;
      return 0;
    };

    return { active: filtered, completed: completedTasks, getTabCount };
  };

  const { active: activeTasks, completed: completedTasks, getTabCount } = getFilteredTasks();

  // Add Task Modal
  const AddTaskModal = () => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(today);
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;
      addTask(title.trim(), date, priority);
    };

    return (
      <div className="modal-backdrop">
        <form className="modal" onSubmit={handleSubmit}>
          <h3>New Task</h3>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
          <input type="date" value={date} min={formatDate(new Date())} onChange={(e) => setDate(e.target.value)} required />
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="modal-buttons">
            <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    );
  };

  const TaskItem = ({ task }: { task: Task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newDate, setNewDate] = useState(task.date);

    const handleSave = async () => {
      try {
        if (newTitle.trim() !== task.title || newDate !== task.date) {
          const updated = { ...task, title: newTitle.trim(), date: newDate };
          await axios.put(`${API}/tasks/${task.id}`, updated);
          setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
        }
        setIsEditing(false);
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <li className={`task-item ${task.completed ? "completed" : ""}`}>
        <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
        {isEditing ? (
          <>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          </>
        ) : (
          <span onClick={() => !task.completed && setIsEditing(true)}>{task.title} - <span className="task-date">{task.date}</span></span>
        )}
        <span className="priority-dot" style={{ backgroundColor: priorityColor[task.priority] }}></span>
        <button onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>{isEditing ? "Save" : "Edit"}</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
      </li>
    );
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1>Neon Todo</h1>
        <div className="tabs">
          {["today", "pending", "overdue"].map((tab) => (
            <button key={tab} className={activeTab === tab ? "active-tab" : ""} onClick={() => setActiveTab(tab as any)}>
              {tab.toUpperCase()} ({getTabCount(tab as any)})
            </button>
          ))}
        </div>
        <button className="new-task-btn" onClick={() => setShowAddModal(true)}>+ New Task</button>
      </aside>

      <main className="main">
        <h2>{activeTab.toUpperCase()} TASKS</h2>
        <ul>
          {activeTasks.length > 0 ? activeTasks.map((task) => <TaskItem key={task.id} task={task} />) : <p>No tasks</p>}
        </ul>
        {completedTasks.length > 0 && (
          <div className="completed-section">
            <h3>COMPLETED ({completedTasks.length})</h3>
            <ul>{completedTasks.map((task) => <TaskItem key={task.id} task={task} />)}</ul>
          </div>
        )}
      </main>

      {showAddModal && <AddTaskModal />}
    </div>
  );
}
