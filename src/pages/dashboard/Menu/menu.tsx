import { NavLink } from "react-router";

const Menu = () => {
  return (
    <div className="bg-gray-900 shadow-md rounded-md p-4 w-64">
      <h4 className="text-md font-semibold text-white-700 mt-4 mb-1">Citas</h4>
      <hr className="border-t border-white-300 my-2" />
      <ul className="list-none pl-0">
        <li className="mb-1">
          <NavLink
            to="citas/agendar"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Agendar Cita
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="citas/list"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver Citas
          </NavLink>
        </li>
      </ul>

      <h4 className="text-md font-semibold text-white-700 mt-4 mb-1">
        Proveedores
      </h4>
      <hr className="border-t border-white-300 my-2" />
      <ul className="list-none pl-0">
        <li className="mb-1">
          <NavLink
            to="providers/list"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver Proveedor
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="providers/create"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Crear Proveedor
          </NavLink>
        </li>
      </ul>

      <h4 className="text-md font-semibold text-white-700 mt-4 mb-1">
        Usuarios
      </h4>
      <hr className="border-t border-white-300 my-2" />
      <ul className="list-none pl-0">
        <li className="mb-1">
          <NavLink
            to="users/list"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver todos usuarios
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="users/create"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Crear Usuario
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="users/forgotPassword"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            recuper contrasena
          </NavLink>
        </li>
      </ul>

      <h4 className="text-md font-semibold text-white-700 mt-4 mb-1">
        Productos
      </h4>
      <hr className="border-t border-white-300 my-2" />
      <ul className="list-none pl-0">
        <li className="mb-1">
          <NavLink
            to="products/create"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Crear Productos
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="products/viewStock"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver Productos
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="products/shop"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Vender Productos
          </NavLink>
        </li>
      </ul>

      <h4 className="text-md font-semibold text-white-700 mt-4 mb-1">Ventas</h4>
      <hr className="border-t border-white-300 my-2" />
      <ul className="list-none pl-0">
        <li className="mb-1">
          <NavLink
            to="ventas"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver las ventas
          </NavLink>
        </li>
        <li className="mb-1">
          <NavLink
            to="cambios"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver los cambios
          </NavLink>
        </li>
      </ul>

      <h4 className="text-md font-semibold text-white-700 mt-4 mb-1">
        Entregas
      </h4>
      <hr className="border-t border-white-300 my-2" />
      <ul className="list-none pl-0">
        <li className="mb-1">
          <NavLink
            to="entregas"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md text-white-600 hover:bg-gray-200 hover:text-gray-800 ${
                isActive ? "bg-blue-500 text-white" : ""
              }`
            }
          >
            Ver entregas
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
