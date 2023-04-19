import React from "react";
import { Helmet } from "react-helmet-async";

interface ComponentWithTitleProps {
  title: string;
  Component: JSX.Element;
}

export default function ComponentWithTitle(props: ComponentWithTitleProps) {
  return (
    <>
      <HelmetTitle title={props.title} />
      {props.Component}
    </>
  );
}

export function HelmetTitle(props: Pick<ComponentWithTitleProps, "title">) {
  return <Helmet title={props.title + " | Twitch ChatBot"}></Helmet>;
}
