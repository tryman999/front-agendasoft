import Menu from "./Menu";
import styles from "./Dashboard.module.css";
import { Outlet, useNavigate } from "react-router";
import BotonFlotante from "../../components/BotonFlotante";
const Dashboard = () => {
  const { container } = styles;
  const navigate = useNavigate();
  const handleClickFlotante = () => {
    navigate("alerts");
  };
  return (
    <div className={container}>
      <Menu />

      <div className="bg-gray-800 w-full p-4 py-8 h-screen overflow-scroll">
        <Outlet />
      </div>

      <BotonFlotante onClick={handleClickFlotante}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="34"
          height="34"
          strokeWidth="2"
        >
          <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      </BotonFlotante>
    </div>
  );
};

export default Dashboard;
