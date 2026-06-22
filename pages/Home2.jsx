import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { loadUser, logout } from '../feature/auth/authSlice';
import { useLocation } from 'react-router-dom'; 
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';


const Home2 = () => {

  const location = useLocation()
   const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


 useEffect(() => {
       if (location.state?.message) {
         const Loginsuccess = () => {

    toast.success(location.state.message, {
      position: "top-center",
      autoClose: 3000,
    }); 
    // Other types:
    // toast.error('Error message!');
    // toast.warning('Warning message!');
    // toast.info('Info message!');
  }
    Loginsuccess();
        }
    dispatch(loadUser());
  }, [location, dispatch]);

  return (

    <>
    
    <div>
      <h1>Home2 Page</h1>
      <p>This is the Home2 page content.</p>


    </div>
    <ToastContainer />
    </>
  )
}

export default Home2