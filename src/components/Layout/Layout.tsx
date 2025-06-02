/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import { Navbar } from ".";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-800 pt-16 pb-16 h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
