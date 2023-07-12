import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import person from './assets/person.svg'
import lock from './assets/lock.svg'
import './Login.css'
import './App.css'

const Login = ({ onLogin  }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/login/', {
      username: username,
      password: password,
    })
    .then(response => {
      localStorage.setItem('authToken', response.data.token);
      onLogin();
      navigate('/home');
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  return (
    <div className="align">
      <div className="grid">
        <form onSubmit={handleSubmit} className="form login">

          <div className="form__field">
            <label htmlFor="login__username"> 
              <img src={person} className="person-icon"/>
            </label>
            <input className="form__input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </div>

          <div className="form__field">
            <label htmlFor="login__password">
              <img src={lock} className="lock-icon"/>
            </label>
            <input className="form__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>

          <div className="form__field">
            <input type="submit" value="Sign In" />
          </div>

        </form>

        <p className="text--center">Not a member? <a href="/register">Sign up now</a></p>

      </div>

    </div>  
  );
};

export default Login;

