import React, { useState, useEffect } from 'react';
import validateEmail from '../../utils/validateEmail';
import validateName from '../../utils/validateName';
import { register, login } from '../../services/auth.service';
import { Navigate } from "react-router-dom";
//import Table from '../Table/index'
import './App.css';

//<Link to="/signup">Sign up</Link>

function App() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pswdLengthError, setPswdLengthError] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const [loading, setLoading] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);

  useEffect(() => {
    setErrorMsg("");
    if (!name) {
      setNameError('');
    } else {
      if (validateName(name)) {
        setNameError('');
      } else {
        setNameError('Please use only letters and spaces.');
      }
    }
  }, [name]);

  useEffect(() => {
    setErrorMsg("");
    if (!email) {
      setEmailError("");
    } else {
      if (validateEmail(email)) {
        setEmailError("");
      } else {
        setEmailError("Please enter a valid email.");
      }
    }
  }, [email]);

  useEffect(() => {
    setErrorMsg("");
    if (!confirmPassword || !password) {
      setPasswordError("");
    } else {
      if (password !== confirmPassword) {
        setPasswordError("The passwords must match.");
      } else {
        setPasswordError("");
      }
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrorMsg("");
    if (!password) {
      setPswdLengthError("");
    } else {
      if (password.length < 8) {
        setPswdLengthError("Password must have at least 8 characters.");
      } else {
        setPswdLengthError("");
      }
    }
  }, [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = !name || !validateName(name) || !email || !validateEmail(email) || !password || !confirmPassword || password !== confirmPassword || password.length < 8;
    if (error) {
      setErrorMsg("Complete every field correctly to sign up!");
    } else {
      setLoading(true);
      await register(name, email, password)
        .then(() => {
          login(email, password);
        })
        .then(response => {
          setLoading(false);
          setRedirect(true);
        })
        .catch(err => {
          setErrorMsg("Email is already in use!");
          setLoading(false);
        });
    }
  }

  const handleRedirect = (event) => {
    event.preventDefault();
    setRedirectLogin(true);
  }

  return (
    <> 
      {redirectLogin ? <Navigate to="/signin"/> : (
        redirect ? <Navigate to="/table"/> : (
          <div className='App'>
            <form>
              <h3>Please sign up</h3>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Name"
              />
              <div className="error">{nameError}</div>
  
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
              />
              <div className="error">{emailError}</div>
  
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
              <div className="error">{pswdLengthError}</div>
  
              <input
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
              />
              <div className="error">{passwordError}</div>
  
              <button 
                onClick={e => handleSubmit(e)}
              >
                  {loading ? "Loading..." : "Submit"}
              </button>
              <div className="error">{errorMsg}</div>
            </form>
            <h4>Already have an account?</h4>
            <button onClick={e => handleRedirect(e)}>Sign in!</button>
          </div>
        )
      )}
    </>
    
  );
}

export default App;
