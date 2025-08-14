import React from "react";
import { useDispatch } from "react-redux";
import ThemeToggle from "../../component/ThemeToggle";
import NoVideo from "./NoVideo";
import CardViewListing from "./CardViewListing/CardViewListing";
import ListViewListing from "./ListViewListing/ListViewListing";

const Home = () => {
  const dispatch = useDispatch();

  return (
    <>
      {/* <NoVideo /> */}
      {/* <CardViewListing /> */}
      <ListViewListing />
    </>
  );
};

export default Home;
