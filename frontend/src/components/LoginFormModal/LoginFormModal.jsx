import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
        window.location.reload();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data.errors && data.errors.includes("Invalid credentials")) {
          setErrors({ credential: "The provided credentials were invalid." });
        } else {
          setErrors({ credential: "Unknown error occurred, please try again." });
        }
      });
  };
  const handleDemoLogin = () => {
    dispatch(sessionActions.demoLogin())
      .then(() => {
        closeModal();
        window.location.reload();
      })
      .catch((error) => {
        setErrors({ credential: "Demo login failed. Please try again." });
        console.error('Demo login error:', error);
      });
  };
  const isDisabled = credential.length < 4 || password.length < 6;
  return (
    <div className="login-form-container">
      <h1>Log In</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="error-message">{errors.credential}</p>}
        <button type="submit" disabled={isDisabled}>Log In</button>
      </form>
      <a href="#" onClick={handleDemoLogin} className="demo-user-link">Demo User</a>
    </div>
  );
}

export default LoginFormModal;