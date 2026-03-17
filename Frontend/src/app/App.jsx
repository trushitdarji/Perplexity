import { RouterProvider } from "react-router";
import { router } from "./app.route";

export default function App() {
  return <RouterProvider router={router} />;
}
