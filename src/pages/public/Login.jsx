import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const user = await login(form);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message || "Unable to login.");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3">Login</h1>
        <AlertMessage type="danger" message={error} />
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label className="form-label">Password</label>
        <input className="form-control mb-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="btn btn-success w-100" type="submit">Login</button>
        <p className="small mt-3 mb-0">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}

export default Login;
