import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Example from "./component/Example";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./component/Layout";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./pages/Home/Home";
import VideoDetail from "./pages/VideoDetail/VideoDetail";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuthStatus } from "./app/features/userSlice";
import Channel from "./pages/Channel/Channel";
import OnPageDialogBoxes from "./component/dialogBox/OnPageDialogBoxes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
          </Route> */}
          <Route index element={<Home />} />
          <Route path="channel/:username" element={<Channel />} />
          <Route path="video/:id" element={<VideoDetail />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer position="bottom-right" />
      <OnPageDialogBoxes />
    </BrowserRouter>
  );
}

export default App;
