import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // {
      //   path: "about",
      //   element: <About />,
      // },
    ],
  },
]);

export default router;
