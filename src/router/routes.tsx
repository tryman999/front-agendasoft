import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Layout } from "../components/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useSessionStorage } from "../utils/hook/useSessionStorage";
import Dashboard from "../pages/dashboard";
import { CreateProducts } from "../pages/dashboard/products";
import { ProveedorList } from "../pages/dashboard/providers";
import ForgotPasswordForm from "../pages/ForgotPassword";
import { UsersList } from "../pages/dashboard/usersList/UsersList";
import { ProductList } from "../pages/dashboard/products/ProductList/ProductList";
import LowStockProductsList from "../pages/LowStock";
import { Cliente } from "../pages/perfil/cliente";
import { Shop } from "../pages/Shop";
import ShoppingCartPage from "../pages/ShoppingCart";
import { Ventas } from "../pages/dashboard/ventas";
import { FormsProveedor } from "../pages/dashboard/providers/form";
import ListaDeCambios from "../pages/dashboard/cambios";
import CrearCita from "../pages/dashboard/citas/crear";
import ListarCitas from "../pages/dashboard/citas/ListarCitas";
import ListarCitasPerfil from "../pages/perfil/tecnico/agenda";
import { Tecnico } from "../pages/perfil/tecnico";
import Entregas from "../pages/dashboard/entregas";

export const ProtectedRoute = () => {
  const { storage } = useSessionStorage("user", null);
  if (!storage) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

export const PrivateRoute = () => {
  const { storage } = useSessionStorage("user", null);
  console.log("PPPP", storage);
  if (storage) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

// eslint-disable-next-line react-refresh/only-export-components
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          { path: "Registro", element: <Register /> },
          { path: "Recuperar-cuenta", element: <ForgotPasswordForm /> },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "perfil/auxiliar",
            element: <Shop />,
          },
          {
            path: "perfil/cliente",
            element: <Cliente />,
          },
          {
            path: "perfil/tecnico",
            element: <Tecnico />,
            children: [
              {
                path: "agenda",
                element: <ListarCitasPerfil />,
              },
            ],
          },

          { path: "shoppingCart", element: <ShoppingCartPage /> },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                index: true,
                element: <LowStockProductsList />,
              },
              {
                path: "products/create",
                element: <CreateProducts productData={undefined} />,
              },
              {
                path: "products/viewStock",
                element: <ProductList />,
              },
              {
                path: "products/shop",
                element: <Shop />,
              },
              {
                path: "providers/list",
                element: <ProveedorList />,
              },
              {
                path: "providers/create",
                element: <FormsProveedor />,
              },
              {
                path: "users/create",
                element: <Register />,
              },
              { path: "users/list", element: <UsersList /> },
              { path: "users/forgotPassword", element: <ForgotPasswordForm /> },
              { path: "alerts", element: <LowStockProductsList /> },
              { path: "shoppingCart", element: <ShoppingCartPage /> },
              { path: "ventas", element: <Ventas /> },
              { path: "entregas", element: <Entregas /> },
              { path: "cambios", element: <ListaDeCambios /> },
              { path: "citas/agendar", element: <CrearCita /> },
              { path: "citas/list", element: <ListarCitas /> },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <h1>404 not found</h1>,
      },
    ],
  },
  {
    path: "*",
    element: <h1>404 not found</h1>,
  },
]);
