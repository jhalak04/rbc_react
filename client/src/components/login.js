import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Admin from './admin';
import useToken from '../useToken';
import { useNavigate } from 'react-router-dom';

async function loginUser(credentials) {
    return fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(response => response.json())
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    // submit admin username / password to login
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        setToken(token);
        if(localStorage.getItem('token')){
            navigate("/admin");
        }
    }
    return(
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form className="form-control" onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" className="form-control" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};