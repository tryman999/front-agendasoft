import { useSessionStorage } from "../../../utils/hook/useSessionStorage";
//import { useCartStore } from "../../../utils/zustand/store/useCartStore";
//import ShoppingCartIconWithBadge from "../../ShoppingCartIcon";
import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router";
const Navbar = () => {
  const { header, nav, list, listItem } = styles;
  const { storage, removeValue } = useSessionStorage("user", null);
  //const products = useCartStore((state) => state.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeValue();
    navigate(0);
  };

  return (
    <header className={header}>
      <nav className={nav}>
        <ul className={list}>
          {/**
          <li className={listItem}>
            <NavLink to="/">Inicio </NavLink>
          </li>
           */}
          {storage?.thereIsAdmin && (
            <li className={listItem}>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
          )}
          {storage?.user?.rol_id === 4 && (
            <li className={listItem}>
              <NavLink to="/perfil/cliente">Perfil:(Cliente)</NavLink>
            </li>
          )}

          {storage?.user?.rol_id === 3 && (
            <li className={listItem}>
              <NavLink to="/perfil/tecnico">Perfil:(tecnico)</NavLink>
            </li>
          )}
          {!storage ? (
            <>
              <li className={listItem}>
                <NavLink to="/Login">Login</NavLink>
              </li>
              {/**  <li className={listItem}>
                <NavLink to="/Registro">Registro</NavLink>
              </li> */}
            </>
          ) : (
            <li className={listItem}>
              <NavLink to="/" onClick={handleLogout}>
                Cerrar sesion
              </NavLink>
            </li>
          )}
          {/*products.length > 0 && (
            <li className={listItem}>
              <NavLink to="/shoppingCart" className="flex gap-2">
                finalizar compra <ShoppingCartIconWithBadge />
              </NavLink>
            </li>
          )*/}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
