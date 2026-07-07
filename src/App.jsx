import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import BrowseProducts from "./pages/public/BrowseProducts";
import ProductDetails from "./pages/public/ProductDetails";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import AddProduct from "./pages/farmer/AddProduct";
import MyProducts from "./pages/farmer/MyProducts";
import EditProduct from "./pages/farmer/EditProduct";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerInquiries from "./pages/farmer/FarmerInquiries";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import MyOrders from "./pages/buyer/MyOrders";
import MyInquiries from "./pages/buyer/MyInquiries";
import Favorites from "./pages/buyer/Favorites";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageCategories from "./pages/admin/ManageCategories";

function App() {
  return (
    <BrowserRouter>
      {/* Public pages are visible to everyone. Protected groups below require login and role checks. */}
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<BrowseProducts />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={["farmer"]} />}>
            <Route path="/farmer" element={<DashboardLayout />}>
              <Route index element={<FarmerDashboard />} />
              <Route path="profile" element={<FarmerProfile />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="products/:id/edit" element={<EditProduct />} />
              <Route path="orders" element={<FarmerOrders />} />
              <Route path="inquiries" element={<FarmerInquiries />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["buyer"]} />}>
            <Route path="/buyer" element={<DashboardLayout />}>
              <Route index element={<BuyerDashboard />} />
              <Route path="profile" element={<BuyerProfile />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="inquiries" element={<MyInquiries />} />
              <Route path="favorites" element={<Favorites />} />
            </Route>
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="categories" element={<ManageCategories />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
