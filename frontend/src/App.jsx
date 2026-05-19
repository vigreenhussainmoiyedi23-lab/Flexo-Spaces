import Approutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socketManager } from "./utils/socket";
import { useEffect } from "react";
import 'react-loading-skeleton/dist/skeleton.css'
const App = () => {
  useEffect(() => {
    socketManager.init();
    socketManager.connect();
  }, []);
  return (
    <>
      <ToastContainer />
      <Approutes />
    </>
  );
};

export default App;
