import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Backend URL
const API_URL = "";

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
  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { title: task, task, status: "pending" });
        setEditId(null);
      } else {
        await axios.post(API_URL, { title: task, task });
      }
      setTask("");
      loadTodos();
    } catch (err) {
      console.error("Error adding/updating todo:", err);
    }
  };

  // Delete todo
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
      <h1>Taskhub</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTodo} disabled={!task.trim()}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {todos.length === 0 && <p>No tasks yet!</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.task}</span>
            <div className="actions">
              <button className="edit" onClick={() => startEdit(todo)}>Edit</button>
              <button className="delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;











// import './App.css'

// interface Item {
//   id: number;
//   name: string;
//   description: string;
// }

// function App() {
//   const [items, setItems] = useState<Item[]>([
//     { id: 1, name: "Apple", description: "A red fruit" },
//     { id: 2, name: "Banana", description: "A yellow fruit" },
//     { id: 3, name: "Carrot", description: "An orange vegetable" },
//   ]);

//   const [query, setQuery] = useState(""); 
//   const [updates, setUpdates] = useState<{ [key: number]: string }>({}); 

//   const handleUpdate = (id: number) => {
//     setItems(items.map(item =>
//       item.id === id
//         ? { ...item, description: updates[id] || item.description }
//         : item
//     ));
//     setUpdates({ ...updates, [id]: "" }); 
//   };

//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2>Midterm Exam | Search and Update item using array</h2>

      
//       <input
//         type="text"
//         placeholder="Search Item..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

    
//       {filteredItems.map(item => (
//         <div key={item.id} >
//           <h3>{item.name}</h3>
//           <p>{item.description}</p>

//           <input
//             type="text"
//             placeholder="New description"
//             value={updates[item.id] || ""}
//             onChange={(e) =>
//               setUpdates({ ...updates, [item.id]: e.target.value })
//             }
//           />

//           <button onClick={() => handleUpdate(item.id)}>Update</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;




























// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// import './App.css'
// import React, { useState } from "react";

// export default function SimpleBMICalculator() {
//   const [weight, setWeight] = useState("");
//   const [height, setHeight] = useState("");
//   const [bmi, setBmi] = useState<string | null>(null);
//   const [category, setCategory] = useState<string | null>(null);
//   const [tip, setTip] = useState<string | null>(null);

//   const calculateBMI = () => {
//     const w = parseFloat(weight);
//     const h = parseFloat(height);
//     const bmiValue = w / (h * h);
//     setBmi(bmiValue.toFixed(2));

//     if (bmiValue < 18.5) {
//       setCategory("Underweight");
//       setTip("Tip: Consider a nutrient-rich diet to reach a healthy weight.");
//     } else if (bmiValue < 25) {
//       setCategory("Normal weight");
//       setTip("Tip: Maintain your healthy lifestyle.");
//     } else if (bmiValue < 30) {
//       setCategory("Overweight");
//       setTip("Tip: Try adding more physical activity and adjusting your diet.");
//     } else {
//       setCategory("Obese");
//       setTip("Tip: Consult a healthcare provider for guidance.");
//     }
//   };

//   const clearAll = () => {
//     setWeight("");
//     setHeight("");
//     setBmi(null);
//     setCategory(null);
//     setTip(null);
//   };

//   return (
//     <>
//       <h2 >BMI Calculator</h2>
//       <input
//         type="number"
//         placeholder="Enter Weight"
//         value={weight}
//         onChange={(e) => setWeight(e.target.value)}
        
//       />
//       <br />
//       <input
//         type="number"
//         placeholder="Enter Height"
//         value={height}
//         onChange={(e) => setHeight(e.target.value)}
        
//       />
//       <br />
//       <br />
//       <button onClick={calculateBMI} >Calculate BMI</button>
//       <br />
//       <br />
//       <button onClick={clearAll} >Clear</button>
//       <br />
//       {bmi && category && (
//         <>
//           Your BMI: <strong>{bmi}</strong><br /> ({category})<br />
//           {tip}
//         </>
//       )}
//     </>
//   );
// }




// import React, { useState } from "react";
// import "./App.css";

// // Custom types
// type UserType = "Admin" | "Guest";
// type Operation = "add" | "subtract" | "multiply" | "divide";

// // Function types
// type CalculateTotalFn = (nums: string[], op: Operation) => void;
// type NumberChangeFn = (index: number, value: string) => void;
// type OperationChangeFn = (op: Operation) => void;

// // Interface for App state
// interface AppState {
//   userType: UserType;
//   loggedIn: boolean;
//   userName: string;
//   numbers: string[];
//   total: number | null;
//   operation: Operation;
// }

// function App() {
//   // State using interface (for demonstration, not strictly necessary in hooks)
//   const [userType, setUserType] = useState<AppState["userType"]>("Admin");
//   const [loggedIn, setLoggedIn] = useState<AppState["loggedIn"]>(false);
//   const [userName, setUserName] = useState<AppState["userName"]>("");
//   const [numbers, setNumbers] = useState<AppState["numbers"]>(["", "", ""]);
//   const [total, setTotal] = useState<AppState["total"]>(null);
//   const [operation, setOperation] = useState<AppState["operation"]>("add");

//   // Function implementations
//   const handleLogin: () => void = () => {
//     if (userName === "") {
//       alert("Please enter your name.");
//       return;
//     }
//     setLoggedIn(true);
//     setNumbers(["", "", ""]);
//     setTotal(null);
//   };

//   const handleLogout: () => void = () => {
//     setLoggedIn(false);
//     setUserName("");
//     setNumbers(["", "", ""]);
//     setTotal(null);
//     setOperation("add");
//   };

//   const handleNumberChange: NumberChangeFn = (index, value) => {
//     const newNumbers = [...numbers];
//     newNumbers[index] = value;
//     setNumbers(newNumbers);
//     calculateTotal(newNumbers, operation);
//   };

//   const handleOperationChange: OperationChangeFn = (op) => {
//     setOperation(op);
//     calculateTotal(numbers, op);
//   };

//   const calculateTotal: CalculateTotalFn = (nums, op) => {
//     // Assertion: nums is string[]
//     const validNumbers = nums
//       .map((num) => parseFloat(num))
//       .filter((num) => !isNaN(num));
//     let result: number | null = null;
//     if (validNumbers.length > 0) {
//       if (op === "add") {
//         result = validNumbers.reduce((a, b) => a + b, 0);
//       } else if (op === "subtract") {
//         result = validNumbers.reduce((a, b) => a - b);
//       } else if (op === "multiply") {
//         result = validNumbers.reduce((a, b) => a * b, 1);
//       } else if (op === "divide") {
//         result = validNumbers.reduce((a, b) => a / b);
//       }
//     }
//     setTotal(result);
//   };

//   return (
//     <>
//       <h1>Calculator Login</h1>
//       {!loggedIn ? (
//         <>
//           <label></label>
//           <input
//             type="text"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//             placeholder=""
//           />
//           <br />
//           <select
//             value={userType}
//             onChange={(e) => setUserType(e.target.value as UserType)}

//           > <option value="Guest">Guest</option>
//             <option value="Admin">Admin</option>
            
//           </select>
//           <br />
//           <button onClick={handleLogin}>Login</button>
//         </>
//       ) : (
//         <>
//           <p>
//             Welcome {userName} ({userType})
//           </p>
//           {userType === "Admin" ? (
//             <>
            
                
              
//               <br />
//               <label>Num 1: </label>
//               <input
//                 type="number"
//                 value={numbers[0]}
//                 onChange={(e) => handleNumberChange(0, e.target.value)}
//               />
//               <br />
//               <label>Num 2: </label>
//               <input
//                 type="number"
//                 value={numbers[1]}
//                 onChange={(e) => handleNumberChange(1, e.target.value)}
//               />
//               <br />
//               <button
//                   type="button"
//                   onClick={() => handleOperationChange("add")}
//                 >
//                   Addition
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleOperationChange("subtract")}
//                 >
//                   Subtraction
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleOperationChange("multiply")}
//                 >
//                   Multiplication
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleOperationChange("divide")}
//                 >
//                   Division
//                 </button>
//                 <br />
//               <h2>Total: {total !== null ? total : ""}</h2>
             
             
              
//               <button onClick={handleLogout}>Logout</button>
//             </>
            
//           ) : (
//             <>
//               <p>Guests cannot use the calculator.</p>
              
//               <button onClick={handleLogout}>Logout</button>
//             </>
//           )}
//         </>
//       )}
//     </>
//   );
// }
// export default App;



