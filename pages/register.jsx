import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../feature/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [response, setResponse] = useState(null);


  

  useEffect(() => {
    if (response && response.error) {
      toast.error(response.error, { 
        position: 'top-center',
        autoClose: 3000 
      });
    } else if (response && response.success) {
      toast.success(response.success, { 
        position: 'top-center', 
        autoClose: 3000 
      });   
    }
  }, [response]);


  


    // redirect on register success
  const registerSuccess = () => {
    toast.success('Registration successful!', {
      position: 'top-center',
      autoClose: 3000,
    });

 
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(register(form));

      if (register.fulfilled.match(result)) {
        setResponse({ success: 'Registration successful!' });
        setForm({ name: '', email: '', password: '' }); // 🔄 Clear form
        registerSuccess();
      } else if (register.rejected.match(result)) {
        setResponse({ error: result.payload || 'Registration failed.' });
      }
    } catch (error) {
      setResponse({ error: error.message || 'An unexpected error occurred.' });
    }

    // console.log('Form submitted:', form);
  };

  return (
    <>
    
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          minWidth: '320px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#3a7bd5',
          }}
        >
          Register
        </h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{
            padding: '0.8rem',
            borderRadius: '6px',
            border: '1px solid #dbeafe',
            fontSize: '1rem',
          }}
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{
            padding: '0.8rem',
            borderRadius: '6px',
            border: '1px solid #dbeafe',
            fontSize: '1rem',
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{
            padding: '0.8rem',
            borderRadius: '6px',
            border: '1px solid #dbeafe',
            fontSize: '1rem',
          }}
        />

        <button
          type="submit"
          style={{
            padding: '0.9rem',
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Register
        </button>

        {response && (
          <div
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: response.error ? 'red' : 'green',
              fontWeight: 'bold',
            }}
          >
            {/* {response.success && <span>{response.success}</span>}  */}
           {response.error && <span>{response.error}</span>}
          </div>
        )}
      </form>
    </div>
    <ToastContainer />
    </>
  );
};

export default Register;