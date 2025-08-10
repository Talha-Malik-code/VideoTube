import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Container from "./Container";

const Layout = () => {
  return (
    <div className="h-screen overflow-y-auto bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-white">
      <Header />
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <Sidebar />
        <Container>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;
