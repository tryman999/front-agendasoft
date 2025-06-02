/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router";

interface EmailDropdownProps {
  emails: any[];
  onSelect: (email: string) => void;
  onSelectEmail?: (value: any) => void;
  selected: string;
}

const EmailDropdown: React.FC<EmailDropdownProps> = ({
  emails,
  onSelect,
  onSelectEmail,
  // selected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("Seleccionar");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm(""); // Limpiar el buscador al abrir/cerrar
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSelect = (name: string, usuario_id: any, email: any) => {
    setSelectedEmail(name);

    setIsOpen(false);
    setSearchTerm(""); // Limpiar el buscador después de seleccionar
    onSelect(usuario_id);
    if (onSelectEmail) onSelectEmail(email);
    // Aquí puedes agregar la lógica para usar el documento seleccionado
  };

  const filteredEmails = emails.filter(
    (item: any) =>
      item.documento?.toLowerCase().includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="dropdown-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {selectedEmail}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.17 8.23a.75.75 0 01.06-1.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-99 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <input
              type="text"
              className="block w-full px-4 py-2 text-gray-900 text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-t-md"
              placeholder="Buscar documento o email..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <ul className="max-h-40 overflow-y-auto">
              {filteredEmails.length === 0 && (
                <li>
                  <NavLink
                    to="/dashboard/users/create"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Crear Usuario
                  </NavLink>
                </li>
              )}
              {filteredEmails.map((item: any, index: any) => (
                <li key={index}>
                  <button
                    onClick={() =>
                      handleSelect(
                        item.nombre_cliente,
                        item.usuario_id,
                        item.email
                      )
                    }
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    {item.documento} - {item.email}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDropdown;
