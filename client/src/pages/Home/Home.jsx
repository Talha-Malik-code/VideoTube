import React from "react";
import Button from "../../component/Button";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../app/features/userSlice";
import ThemeToggle from "../../component/ThemeToggle";
import NoVideo from "./NoVideo";
import CardViewListing from "./CardViewListing/CardViewListing";
import ListViewListing from "./ListViewListing/ListViewListing";

const Home = () => {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <>
      {/* <NoVideo /> */}
      {/* <CardViewListing /> */}
      <ListViewListing />
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default Home;
