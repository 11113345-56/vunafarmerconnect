import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const linksByRole = {
  farmer: [
    ["Dashboard", "/farmer"],
    ["Profile", "/farmer/profile"],
    ["Add Product", "/farmer/products/new"],
    ["My Products", "/farmer/products"],
    ["Orders", "/farmer/orders"],
    ["Inquiries", "/farmer/inquiries"]
  ],
  buyer: [
    ["Dashboard", "/buyer"],
    ["Profile", "/buyer/profile"],
    ["Browse", "/products"],
    ["My Orders", "/buyer/orders"],
    ["My Inquiries", "/buyer/inquiries"],
    ["Favorites", "/buyer/favorites"]
  ],
  admin: [
    ["Dashboard", "/admin"],
    ["Users", "/admin/users"],
    ["Products", "/admin/products"],
    ["Orders", "/admin/orders"],
    ["Categories", "/admin/categories"]
  ]
};

function DashboardLayout() {
  const { user } = useAuth();
  const links = linksByRole[user?.role] || [];

  return (
    <>
      <Navbar />
      <div className="container-fluid dashboard-shell">
        <div className="row">
          <aside className="col-lg-2 dashboard-sidebar">
            <div className="list-group list-group-flush">
              {links.map(([label, to]) => (
                <NavLink key={to} to={to} end className="list-group-item list-group-item-action">
                  {label}
                </NavLink>
              ))}
            </div>
          </aside>
          <section className="col-lg-10 dashboard-content">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
