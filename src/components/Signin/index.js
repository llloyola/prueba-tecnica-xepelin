import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import validateEmail from '../../utils/validateEmail';
import { login } from '../../services/auth.service';
import './Signin.css';


function Signin() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
  
    const [password, setPassword] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
  
    const [loading, setLoading] = useState(false);
  
    const [redirect, setRedirect] = useState(false);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const error = !email || !validateEmail(email) || !password;
      if (error) {
        setErrorMsg("Complete every field correctly to sign in!");
      } else {
        setLoading(true);
        await login(email, password)
          .then(response => {
            setLoading(false);
            setRedirect(true);
          })
          .catch(err => {
            setLoading(false);
            setErrorMsg("Email doesn't match the password. Try again.");
          });
      }
    }
  
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
  
    return (
      <> 
        {redirect ? <Navigate to="/table"/> : (
          <div className='signin'>
            <form>
              <h3>Please sign in</h3>
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
              <div className="error">{""}</div>
  
              <button 
                onClick={e => handleSubmit(e)}
              >
                  {loading ? "Loading..." : "Submit"}
              </button>
              <div className="error">{errorMsg}</div>
            </form>
          </div>
        )}
      </>
      
    );
  }
  
  export default Signin;
