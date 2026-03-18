import { RouterProvider } from "react-router";
import { router } from "./app.route";
import  useAuth  from "../feature/auth/hook/useAuth";
import { useEffect } from "react";

export default function App() {

  const auth = useAuth()

  useEffect(()=>{
    auth.handlegetMe()
  },[])

  return <RouterProvider router={router} />;
}
