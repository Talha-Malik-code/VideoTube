import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Container from "./Container";
import OnContainerDialogBoxes from "./dialogBox/OnContainerDialogBoxes";
import useNetworkStatus from "../hooks/useNetworkStatus";
import NoInternetConnection from "./notFound/NoInternetConnection";
import { useSelector } from "react-redux";
import { selectError } from "../app/features/userSlice";
import ServerNotAvailable from "./notFound/ServerNotAvailable";

const Layout = () => {
  // const isOnline = useNetworkStatus();
  const error = useSelector(selectError);

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 text-gray-900 dark:bg-[#121212] dark:text-white">
      <Header />
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <Sidebar />
        <Container>
          {
            // !isOnline
            error === "Internal Server Error" ? (
              // <NoInternetConnection />
              <ServerNotAvailable />
            ) : (
              <>
                <Outlet />
                <OnContainerDialogBoxes />
              </>
            )
          }
        </Container>
      </div>
    </div>
  );
};

export default Layout;
