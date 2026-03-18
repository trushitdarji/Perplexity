import { createBrowserRouter } from "react-router";
import Login from "../feature/auth/pages/Login";
import Register from "../feature/auth/pages/Register";
import Dashboard from "../feature/chat/pages/Dashboard";
import Protected from "../feature/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
]);
