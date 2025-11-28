import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Correct Backend URL
const API_URL = "https://backend1-12-kene.onrender.com";

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

  // Add or update todo
  const addTodo = () => {
    if (!task.trim()) return;

    if (editId) {
      // UPDATE
      const updatedTodo = { id: editId, title: task, task, status: "pending" };

      // Optimistic UI update
      setTodos((prev) => prev.map((t) => (t.id === editId ? updatedTodo : t)));

      axios
        .put(`${API_URL}/${editId}`, updatedTodo)
        .catch(console.error);

      setEditId(null);
    } else {
      // ADD
      const tempId = Date.now();
      const newTodo = { id: tempId, title: task, task, status: "pending" };

      setTodos((prev) => [...prev, newTodo]);

      axios
        .post(API_URL, { title: task, task, status: "pending" })
        .then((res) => {
          setTodos((prev) =>
            prev.map((t) => (t.id === tempId ? res.data : t))
          );
        })
        .catch(console.error);
    }

    setTask("");
  };

  // Delete todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    axios.delete(`${API_URL}/${id}`).catch(console.error);
  };

  // Start edit
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
              <button
                className="neon-btn edit"
                onClick={() => startEdit(todo)}
              >
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
