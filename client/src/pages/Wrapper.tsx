import React, { type ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
};

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex overflow-hidden">{children}</div>
  );
};

export default Wrapper;
