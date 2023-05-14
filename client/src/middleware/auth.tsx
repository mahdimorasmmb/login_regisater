import React, { FC } from "react";
import { Navigate } from "react-router-dom";

const AuthorizeUser = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={"/"} replace={true} />;
  }
  return <>{children}</>;
};

export default AuthorizeUser;
