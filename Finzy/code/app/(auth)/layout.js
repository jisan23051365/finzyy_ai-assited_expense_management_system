import React from "react";

const AuthLayout = ({ children }) => {
  // Change if need padding
  return <div className="flex justify-center pt-26"> {children} </div>;
};

export default AuthLayout;
