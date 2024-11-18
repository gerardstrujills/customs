import React from "react";
import LeftSidebar from "./LeftSidebar";
import { MeQuery } from "@/gen/gql";

const Container: React.FC<{
  className?: string;
  children: React.ReactNode;
  user: MeQuery;
}> = ({ className, children, user }) => {
  return (
    <div className="container">
      <LeftSidebar user={user} />
      <div
        id="content"
        className={`snippet-hidden ${className ? className : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
