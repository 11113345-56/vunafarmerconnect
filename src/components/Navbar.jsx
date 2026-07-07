import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const dashboardPath = user ? `/${user.role}` : "/login";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">FarmConnect</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/products">Browse</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            {user && <NavLink className="nav-link" to={dashboardPath}>Dashboard</NavLink>}
          </div>
          <div className="navbar-nav ms-auto">
            {!user && <NavLink className="nav-link" to="/login">Login</NavLink>}
            {!user && <NavLink className="btn btn-light btn-sm ms-lg-2" to="/register">Register</NavLink>}
            {user && (
              <>
                <span className="navbar-text text-white me-lg-3">{user.full_name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
