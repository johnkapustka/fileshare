import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import person from './assets/person.svg';
import lock from './assets/lock.svg';
import './Register.css';
import './App.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/register/', {
      username: username,
      password: password,
    })
    .then(response => {
      localStorage.setItem('authToken', response.data.token);
      navigate('/my-files'); 
    })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <div className="align">
      <div className="grid">
        <form onSubmit={handleSubmit} className="form register">

          <div className="form__field">
            <label htmlFor="register__username"> 
              <img src={person} className="person-icon"/>
            </label>
            <input id="register__username" className="form__input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </div>

          <div className="form__field">
            <label htmlFor="register__password">
              <img src={lock} className="lock-icon"/>
            </label>
            <input id="register__password" className="form__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>

          <div className="form__field">
            <input type="submit" value="Sign Up" />
          </div>

        </form>

        <p className="text--center">Already have an account? <a href="/">Sign in now</a></p>

      </div>
    </div>  
  );
};

export default Register;

