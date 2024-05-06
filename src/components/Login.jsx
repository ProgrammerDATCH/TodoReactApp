import React, { useState } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { serverLink } from '../constants';
import { checkPasswordsEquality, validateEmail, validateName, validatePassword } from '../utils';

export const Login = () => {
    const navigate = useNavigate()
    const [formMode, setFormMode] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("")

        if (formData.email.trim() === '' || formData.password.trim() === '') {
            setError('Email and Password are required please!');
            return;
        }

        if (formMode === 'register' && (formData.name.trim() === '')) {
            setError('Please add your name');
            return;
        }
        if (formMode === 'register' && (formData.confirmPassword.trim() === '')) {
            setError('Please repeat the password');
            return;
        }
        if (formMode === 'register' && !checkPasswordsEquality(formData.confirmPassword, formData.confirmPassword)) {
            setError('2 Passwords should match.');
            return;
        }
        if (formMode === 'register' && !validateName(formData.name)) {
            setError('Please use real name');
            return;
        }
        if (!validateEmail(formData.email)) {
            setError('Please use real email');
            return;
        }
        if ( formMode ==='register' && !validatePassword(formData.password)) {
            setError('Please use strong password');
            return;
        }

        try {
            const response = await fetch(`${serverLink}/user/${formMode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return;
            }
            if (!data.status) {
                setError(data.message);
                return;
            }
            if (formMode === "login") {
                document.cookie = `token=${data.message.token}; path=/`;
                navigate("/")
                return;
            }
            setFormMode("login");
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="containers">
            <form onSubmit={handleSubmit}>
                <h1>{formMode === 'login' ? 'Login' : 'Sign Up'}</h1>
                {formMode === 'register' && (
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            className='inputs'
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        className='inputs'
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        className='inputs'
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                {formMode === 'register' && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className='inputs'
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                )}
                <div className="error-span global-error">{error}</div>
                <button className="btns" type="submit">{formMode === 'login' ? 'Login' : 'Sign Up'}</button>
                <p>
                    {formMode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button className="btns" type="button" onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}>
                        {formMode === 'login' ? 'Sign up instead' : 'Login instead'}
                    </button>
                </p>
            </form>
        </div>
    );
};