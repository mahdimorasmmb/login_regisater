import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Loding from "./components/Loding";
import PageNotFound from "./components/PageNotFound";
import AuthorizeUser from "./middleware/auth";

const Username = React.lazy(() => import("./components/Username"));
const Password = React.lazy(() => import("./components/Password"));
const Reset = React.lazy(() => import("./components/Reset"));
const Register = React.lazy(() => import("./components/Register"));
const Recovery = React.lazy(() => import("./components/Recovery"));
const Profile = React.lazy(() => import("./components/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loding />}>
        <Username />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loding />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/password",
    element: (
      <Suspense fallback={<Loding />}>
        <Password />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Suspense fallback={<Loding />}>
          <Profile />
        </Suspense>
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: (
      <Suspense fallback={<Loding />}>
        <Recovery />
      </Suspense>
    ),
  },
  {
    path: "/reset",
    element: (
      <Suspense fallback={<Loding />}>
        <Reset />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
