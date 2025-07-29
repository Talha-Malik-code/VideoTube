import './App.css'
import Example from './component/Example';
import { ToastContainer, Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Example />
      <ToastContainer position='top-right' autoClose={3000} />
    </>
  )
}

export default App
