import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Example from "./component/Example";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./component/Layout";
import Login from "./pages/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <></>
        </Route>
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
