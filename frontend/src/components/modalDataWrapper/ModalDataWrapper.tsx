import React from "react";

interface ModalDataWrapperProps {
  children: React.ReactNode;
}

export default function ModalDataWrapper({ children }: ModalDataWrapperProps) {
  return <div className="modal-data-wrapper">{children}</div>;
}
