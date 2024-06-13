import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './AdminLoginPage.css';
import { baseUrl } from '../../../utils/baseUrl';
import { isAuthenticated } from '../../../redux/admin/isAdminLogged'

const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!email || !password){
            return setError("Field's can't be empty")
        }

        setError('')

        try {
          fetch(`${baseUrl}/admin/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })
          .then(response => response.json())
          .then(res => {
            if(res.message === 'Admin Verified'){
                localStorage.setItem('adminToken', res.token)
                dispatch(isAuthenticated())
                navigate('/admin')
            }
            else{
                setError('Invalid Credentials')
            }
          })
          
        } catch (error) {
          setError('An error occurred. Please try again.');
        }
      };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Admin Login</h2>
                <p>{error}</p>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleSubmit} type="button">Login</button>
            </div>
        </div>
    );
}

export default AdminLogin
