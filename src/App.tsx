import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Backend URL
const API_URL = " https://backend1-10-oq75.onrender.com";

interface Todo {
  id: number;
  title: string;
  task: string;
  status: string;
}

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // Load todos
  const loadTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error loading todos:", err);
    }
  };

  // Add or update todo (instant UI update)
const addTodo = () => {
  if (!task.trim()) return;

  if (editId) {
    // Edit mode
    const updatedTodo = { id: editId, title: task, task, status: "pending" };
    // Optimistically update UI
    setTodos((prev) => prev.map((t) => (t.id === editId ? updatedTodo : t)));
    setEditId(null);
    // Send update to backend asynchronously
    axios.put(`${API_URL}/${editId}`, updatedTodo).catch(console.error);
  } else {
    // Add mode
    // Generate a temporary ID for immediate UI
    const tempId = Date.now();
    const newTodo = { id: tempId, title: task, task, status: "pending" };
    setTodos((prev) => [...prev, newTodo]);
    // Send POST to backend
    axios
      .post(API_URL, { title: task, task, status: "pending" })
      .then((res) => {
        // Replace temporary ID with real ID from backend
        setTodos((prev) =>
          prev.map((t) => (t.id === tempId ? res.data : t))
        );
      })
      .catch(console.error);
  }

  // Clear input instantly
  setTask("");
};


  // Delete todo (instant UI update)
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    axios.delete(`${API_URL}/${id}`).catch(console.error);
  };

  // Start editing
  const startEdit = (todo: Todo) => {
    setTask(todo.task);
    setEditId(todo.id);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="container">
      <h1>TaskHub</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="neon-btn" onClick={addTodo} disabled={!task.trim()}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {todos.length === 0 && <p className="no-task">No tasks yet!</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.task}</span>
            <div className="actions">
              <button className="neon-btn edit" onClick={() => startEdit(todo)}>Edit</button>
              <button className="neon-btn delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
