import React from "react";
import { Helmet } from "react-helmet-async";

interface ComponentWithTitleProps {
  title: string;
  component: JSX.Element;
}

type HemletTitleProps = Pick<ComponentWithTitleProps, "title">;

export default function ComponentWithTitle({
  title,
  component,
}: ComponentWithTitleProps) {
  return (
    <>
      <HelmetTitle title={title} />
      {component}
    </>
  );
}

export function HelmetTitle({ title }: HemletTitleProps) {
  return <Helmet title={title + " | Twitch ChatBot"}></Helmet>;
}
