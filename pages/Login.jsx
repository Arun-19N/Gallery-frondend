import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../feature/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(null);

  // auth state from redux
  const { user, isLoading, error } = useSelector((state) => state.auth);

  // Show error toast
  useEffect(() => {3
    if (loginError) {
      toast.error(loginError, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  }, [loginError]);

  // redirect on login success
  const loginsuccess = () => {
    toast.success('Login successful!', {
      position: 'top-center',
      autoClose: 3000,
    });

 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null); // reset previous error

    try {
      const result = await dispatch(login(form));

      if (login.fulfilled.match(result)) {
        // success handled in useEffect
        loginsuccess();
        setForm({ email: '', password: '' });
        
      } else if (login.rejected.match(result)) {
        setLoginError(result.payload || 'Login failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred', {
        position: 'top-center',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const formStyle = {
    maxWidth: '350px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    background: '#fff',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    opacity: isLoading ? 0.7 : 1,
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

        <label
          htmlFor="email"
          style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
          autoComplete="email"
          required
          disabled={isLoading}
        />

        <label
          htmlFor="password"
          style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
          autoComplete="current-password"
          required
          disabled={isLoading}
        />

        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <ToastContainer />
    </>
  );
};

export default Login;