import React, {useState, useEffect} from 'react'
import axios from "axios";

function Task() {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/tasks/getAllTasks")
            .then(res => {
                console.log("Data from backend", res.data);
                setTasks(res.data)
            })
            .catch(err => console.error(err));
    }, []);


    function handleInputChange(event) {
        setNewTask(event.target.value);
    }


  function addTask() {
    if (newTask.trim() !== "") {
      axios
        .post("http://localhost:8080/tasks/add", {
          task: newTask,
          completed: false,
        })
        .then(res => {
          setTasks(t => [...t, res.data]);
          setNewTask("");
        })
        .catch(err => console.error("Error adding task:", err));
    }
  }

  function deleteTask(id) {
    axios
      .delete(`http://localhost:8080/tasks/delete/${id}`)
      .then(() => setTasks(tasks.filter(t => t.id !== id)))
      .catch(err => console.error("Error deleting task:", err));
  }

  function markComplete(id) {
    axios
      .patch(`http://localhost:8080/tasks/${id}/completed`)
      .then(res =>
        setTasks(tasks.map(t => (t.id === id ? { ...t, completed: true } : t)))
      )
      .catch(err => console.error("Error marking complete:", err));
  }

return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ol>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              className="text"
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.task}
            </span>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
            {!task.completed && (
              <button
                className="complete"
                onClick={() => markComplete(task.id)}
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Task