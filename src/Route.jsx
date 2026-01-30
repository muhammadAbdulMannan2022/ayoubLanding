import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import ErrorPage from "./pages/Error";
import ThankYou from "./pages/ThankYou";

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
      {
        path: "thankyou",
        element: <ThankYou />,
      },
      {
        path: "thankyoumeeting",
        element: (
          <ThankYou
            title="Meeting Scheduled!"
            subtitle="Your consultation is locked in."
            message="We look forward to seeing you. A calendar invitation has been sent to your email."
          />
        ),
      },
      {
        path: "thankyouformsubmitted",
        element: (
          <ThankYou
            title="Form Sent!"
            subtitle="Thanks for reaching out."
            message="We have received your details and will be in touch shortly."
          />
        ),
      },
    ],
  },
]);

export default router;
