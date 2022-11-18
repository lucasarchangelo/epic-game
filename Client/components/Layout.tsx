import React from "react";
import Menu from "./Menu";

interface Props {
  children: any;
}

export default function Layout(props: Props) {
  return (
    <>
      <Menu></Menu>
      {props.children}
    </>
  );
}
