import React, { useEffect, useState } from 'react';
import '../styles/index.css';
import { addImg, editImg, deleteImg } from '../assets';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../constants';

function Home() {
    const navigate = useNavigate()
    const [todos, setTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showOnePopup, setShowOnePopup] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        checkToken();
        getTodos()
    }, []);

    const getTodos = async () => {
        const token = getCookie("token");
        if (!token) {
            navigate('/login')
            return;
        }
        try {
            const res = await fetch(`${serverLink}/todo/todos`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                console.error('Failed to call API');
                navigate('/login')
                return;
            }
            const data = await res.json();
            if (!data.status) {
                navigate('/login')
            }
            setTodos(data.message);
        }
        catch (error) {
            navigate('/login')
        }
    };



    async function callAPI(apiLink, apiMethod, apiData) {
        const token = getCookie("token");
        if (!token) {
            navigate("/login")
            return;
        }
        const res = await fetch(`${serverLink}${apiLink}`, {
            method: apiMethod,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(apiData),
        });
        if (!res.ok) {
            console.error('Failed to call API');
            return false;
        }
        const data = await res.json();
        if (data.status) {
            await getTodos();
            return true;
        }
        return false;
    }


    const checkToken = async () => {
        const token = getCookie("token");
        if (!token) {
            navigate('/login')
            return;
        }
        try {
            const res = await fetch(`${serverLink}/user/check`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                console.error('Failed to call API');
                navigate('/login')
                return;
            }
            const data = await res.json();
            if (!data.status) {
                navigate('/login')
            }
            setUserName(data.message.name);
        }
        catch (error) {
            navigate('/login')
        }
    };

    const getCookie = (name) => {
        const cookies = document.cookie.split(";").map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split("=");
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    };

    const addTodo = async (title, description) => {
        const newTodo = {
            _id: todos.length + 1,
            title,
            description,
            completed: false
        };
        setTodos([...todos, newTodo]);
        await callAPI("/todo/add", "POST", { title, description });
        setShowAddPopup(false);
    };

    const editTodoItem = async (_id, title, description, completed) => {
        const updatedTodos = todos.map(todo =>
            todo._id === _id ? { ...todo, title, description, completed } : todo
        );
        setTodos(updatedTodos);
        await callAPI("/todo/update", "PATCH", { id: _id, title, description, completed })
        setEditTodo(null);
    };

    const deleteTodo = async (_id) => {
        const updatedTodos = todos.filter(todo => todo._id !== _id);
        await callAPI("/todo/delete", "DELETE", { id: _id });
        setTodos(updatedTodos);
        setShowDeletePopup(false);
    };

    const showAddTodo = () => {
        setShowAddPopup(true);
    };

    const showEditTodo = (_id) => {
        const todoToEdit = todos.find(todo => todo._id === _id);
        setEditTodo(todoToEdit);
    };

    const showOneTodo = (_id) => {
        const todoToShow = todos.find(todo => todo._id === _id);
        setSelectedTodo(todoToShow);
        setShowOnePopup(true);
    };

    const closePopup = () => {
        setShowDeletePopup(false);
        setShowOnePopup(false);
        setEditTodo(null);
    };

    const logoutUser = () => {
        document.cookie = "token=none; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        navigate('/login?logout=true')
    }


    const Todo = ({ todo }) => {
        const checkStatus = todo.completed ? "checked" : undefined;
        const isCompleted = todo.completed ? "completed" : "";
        return (
            <div className="task">
                <input type="checkbox" checked={checkStatus} disabled />
                <div className={`task-details ${isCompleted}`} onClick={() => showOneTodo(todo._id)}>
                    <div className="title">{todo.title}</div>
                    <span className="separator">|</span>
                    <div className="desc">{todo.description}</div>
                </div>
                <div className="task-actions">
                    <div className="action-img-holder"><img className="action-img" src={editImg} onClick={() => showEditTodo(todo._id)} /></div>
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
                <span className="user-name" _id="userName">{userName}</span>
                <span className="logout-btn" _id="logoutBtn" onClick={logoutUser}>Logout</span>
            </div>
            <div className="header">
                <div>Tasks</div>
                <div><img className="action-img" src={addImg} onClick={showAddTodo} /></div>
                <div>Actions</div>
            </div>
            <div className="tasks" _id="tasks">
                {todos.length === 0 ? <p className='no-todo-p'>No Todos!</p> :
                    todos.map(todo => <Todo key={todo._id} todo={todo} />)
                }
            </div>

            {editTodo &&
                <div className="edit-popup" _id="editPopup">
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
                                <button className="edit-btn" onClick={() => editTodoItem(editTodo._id, document.getElementById('title').value, document.getElementById('description').value, document.getElementById('isCompletedCheckbox').checked)}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {showAddPopup &&
                <div className="add-popup" _id="addPopup">
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
                <div className="delete-popup" _id="deletePopup">
                    <div className="contents">
                        <h4>Confirm Deletion</h4>
                        <p>Delete todo <b>{selectedTodo.title}</b> ?</p>
                        <div className="action-btns">
                            <button className="cancel-btn" onClick={closePopup}>Cancel</button>
                            <button className="delete-btn" onClick={() => deleteTodo(selectedTodo._id)}>Delete</button>
                        </div>
                    </div>
                </div>
            }
            {showOnePopup &&
                <div className="one-popup" _id="onePopup">
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


export default Home;