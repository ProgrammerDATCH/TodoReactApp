import React, { useState } from 'react';
import './styles/index.css';
import { addImg, editImg, deleteImg } from './assets';

function App() {
  const [todos, setTodos] = useState([
    {
    id: 1,
    title: "Todo1",
    description: "Todo1Desc",
    completed: false
  },
    {
    id: 2,
    title: "Todo2",
    description: "Todo2Desc",
    completed: true
  }
]);
  const [editTodo, setEditTodo] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showOnePopup, setShowOnePopup] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const addTodo = (title, description) => {
    const newTodo = {
      id: todos.length + 1,
      title,
      description,
      completed: false
    };
    setTodos([...todos, newTodo]);
    setShowAddPopup(false);
  };

  const editTodoItem = (id, title, description, completed) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, title, description, completed } : todo
    );
    setTodos(updatedTodos);
    setEditTodo(null);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    setShowDeletePopup(false);
  };

  const showAddTodo = () => {
    setShowAddPopup(true);
  };

  const showEditTodo = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setEditTodo(todoToEdit);
  };

  const showOneTodo = (id) => {
    const todoToShow = todos.find(todo => todo.id === id);
    setSelectedTodo(todoToShow);
    setShowOnePopup(true);
  };

  const closePopup = () => {
    setShowDeletePopup(false);
    setShowOnePopup(false);
    setEditTodo(null);
  };

  const Todo = ({ todo }) => {
    const checkStatus = todo.completed ? "checked" : undefined;
    const isCompleted = todo.completed ? "completed" : "";
    return (
      <div className="task">
        <input type="checkbox" checked={checkStatus} disabled />
        <div className={`task-details ${isCompleted}`} onClick={() => showOneTodo(todo.id)}>
          <div className="title">{todo.title}</div>
          <span className="separator">|</span>
          <div className="desc">{todo.description}</div>
        </div>
        <div className="task-actions">
          <div className="action-img-holder"><img className="action-img" src={editImg} onClick={() => showEditTodo(todo.id)} /></div>
          <div className="action-img-holder"><img className="action-img" src={deleteImg} onClick={() => { setSelectedTodo(todo); setShowDeletePopup(true); }} /></div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>TODO TASKS</h1>
      <div className="user-info">
        <span className="welcome">Welcome,</span>
        <span className="user-name" id="userName">User</span>
        <span className="logout-btn" id="logoutBtn">Logout</span>
      </div>
      <div className="header">
        <div>Tasks</div>
        <div><img className="action-img" src={addImg} onClick={showAddTodo} /></div>
        <div>Actions</div>
      </div>
      <div className="tasks" id="tasks">
        {todos.map(todo => <Todo key={todo.id} todo={todo} />)}
      </div>
      {editTodo &&
        <div className="edit-popup" id="editPopup">
          <div className="contents">
            <h4>Edit</h4>
            <div id="editForm" className="edit-form">
              <input type="text" id="title" defaultValue={editTodo.title} />
              <textarea id="description" cols="30" rows="10" defaultValue={editTodo.description}></textarea>
              <div className="check">
                <input type="checkbox" id="isCompletedCheckbox" defaultChecked={editTodo.completed} />Mark as Completed
              </div>
              <div className="action-btns">
                <button className="cancel-btn" onClick={() => setEditTodo(null)}>Cancel</button>
                <button className="edit-btn" onClick={() => editTodoItem(editTodo.id, document.getElementById('title').value, document.getElementById('description').value, document.getElementById('isCompletedCheckbox').checked)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      }
      {showAddPopup &&
        <div className="add-popup" id="addPopup">
          <div className="contents">
            <h4>Add New Todo</h4>
            <div id="addForm" className="add-form">
              <input type="text" id="addTitle" placeholder="Title" />
              <textarea id="addDescription" cols="30" rows="10" placeholder="Description"></textarea>
              <div className="action-btns">
                <button className="cancel-btn" onClick={() => setShowAddPopup(false)}>Cancel</button>
                <button className="add-btn" onClick={() => addTodo(document.getElementById('addTitle').value, document.getElementById('addDescription').value)}>ADD</button>
              </div>
            </div>
          </div>
        </div>
      }
      {showDeletePopup &&
        <div className="delete-popup" id="deletePopup">
          <div className="contents">
            <h4>Confirm Deletion</h4>
            <p>Delete todo <b>{selectedTodo.title}</b> ?</p>
            <div className="action-btns">
              <button className="cancel-btn" onClick={closePopup}>Cancel</button>
              <button className="delete-btn" onClick={() => deleteTodo(selectedTodo.id)}>Delete</button>
            </div>
          </div>
        </div>
      }
      {showOnePopup &&
        <div className="one-popup" id="onePopup">
          <div className="contents">
            <h4>{selectedTodo.title}</h4>
            <div>{selectedTodo.description}</div>
            <div>
              <input type="checkbox" disabled checked={selectedTodo.completed} /><span>{selectedTodo.completed ? "Completed" : "Not Completed"}</span>
            </div>
            <button className="cancel-btn" onClick={closePopup}>Close</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;