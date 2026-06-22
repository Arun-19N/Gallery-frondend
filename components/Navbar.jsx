import { HashRouter, Link, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Register from '../pages/register';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Home from '../pages/Home';
import Home2 from '../pages/Home2';
import { PrivateRoute, GuestRoute } from './PrivatesRoute';
import { logout } from '../feature/auth/authSlice';
import UploadImageForm from '../pages/Uploadeuserimg';
import './Nav.css';
import { FaPlus } from 'react-icons/fa';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <HashRouter>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Navbar</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav w-100">

              {user ? (
                <>
                  <Link className="nav-link" to="/Home2">Home</Link>
                  <Link className="nav-link" to="/profile">Profile</Link>
                 
                </>
              ) : (
                <>
                 <Link className="nav-link active" to="/">Home</Link>
                  <Link className="nav-link" to="/register">Register</Link>
                  <Link className="nav-link" to="/login">Login</Link>
                </>
              )}{user && (

               <div className="d-flex ms-lg-auto ">
                    <button className="nav-link  btn btn-link" onClick={handleLogout}>Logout</button>
                  </div>
                  )
              }
            </div>
          </div>
        </div>
      </nav>

      {/* Route Setup */}
      <Routes>
        {/* ✅ Public route */}
      

        {/* ✅ Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ✅ Private/protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/Home2" element={<Home2 />} />
          <Route path="/imgupload" element={<UploadImageForm />} />
          
        </Route>

        {/* Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </HashRouter>
  );
};

export default Navbar;
