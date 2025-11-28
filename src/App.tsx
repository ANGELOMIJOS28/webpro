import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Backend Base URL (CORRECT)
const API_URL = "https://backend1-14-jfgh.onrender.com/todos";

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

  // Load all todos
  const loadTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error loading todos:", err);
    }
  };

  // Add or update
  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      if (editId) {
        // UPDATE
        await axios.put(`${API_URL}/${editId}`, {
          title: task,
          task,
          status: "pending",
        });
        setEditId(null);
      } else {
        // ADD
        await axios.post(API_URL, {
          title: task,
          task,
          status: "pending",
        });
      }

      setTask("");
      loadTodos(); // Refresh list
    } catch (err) {
      console.error("Error adding/updating todo:", err);
    }
  };

  // Delete
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      loadTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
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
              <button className="neon-btn edit" onClick={() => startEdit(todo)}>
                Edit
              </button>
              <button
                className="neon-btn delete"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

