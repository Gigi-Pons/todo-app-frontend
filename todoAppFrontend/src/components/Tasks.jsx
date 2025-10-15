import React, {useState, useEffect} from 'react'
import axios from "axios";

//Task is a functional React component responsible for
//managing states, talkin got the backend API and rendering the to-do list UI
function Task() {

    //State variables
    //tasks is an array that stores all tasks fetched from the backend
    //newTask is a string that holds what the user types in the input box 
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    //This effect runs once and populates the tasks array with data fetched from 
    //the backend
    useEffect(() => {
        axios.get("http://localhost:8080/tasks/getAllTasks")
            .then(res => {
                setTasks(res.data)
            })
            .catch(err => console.error(err));
    }, []);


  //This function is called every time the user types into the input box and
  //updates the newTask to reflect the input value
  function handleInputChange(event) {
      setNewTask(event.target.value);
  }


  //The add function is called when the Add button is clicked.  It checks if the input 
  //isn't empty and then makes a POST request sending a JSON body.  If the post is successful,
  //the returned task is added to the newly created array and newTask is reset
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


  //The deleteTask sends a DELETE request to the backend API for that task id.
  //If successful then it updates the task array using the filter method, leaving
  //the id that was deleted out of the new array
  function deleteTask(id) {
    axios
      .delete(`http://localhost:8080/tasks/delete/${id}`)
      .then(() => setTasks(tasks.filter(t => t.id !== id)))
      .catch(err => console.error("Error deleting task:", err));
  }


  //I used a patch request to only update the column for that specific id
  //setting it to true if the complete button is clicked.  Then it creates a new 
  //array using map and updates the state immutably
  function markComplete(id) {
    axios
      .patch(`http://localhost:8080/tasks/${id}/completed`)
      .then(res =>
        setTasks(tasks.map(t => (t.id === id ? { ...t, completed: true } : t)))
      )
      .catch(err => console.error("Error marking complete:", err));
  }


//This is the return statement and is what the component displays on the screen.
//The UI automatically updates whenever the state changes which shows the latest and
//updates list of tasks without reloading the page
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