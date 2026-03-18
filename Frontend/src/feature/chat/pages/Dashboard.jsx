import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useEffect } from "react";
import { initializeSocketConnection } from "../service/chat.socket";

const Dashboard = () => {
  const chat = useChat();

  const user = useSelector((state) => state.auth);
  console.log(user);

  useEffect(()=>{
    chat.initializeSocketConnection()
  },[])

  return <div>Dashbord</div>;
};

export default Dashboard;
