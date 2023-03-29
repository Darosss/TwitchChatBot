import "./style.css";

export default function ModalDataWrapper(props: { children: React.ReactNode }) {
  const { children } = props;

  return <div className="modal-data-wrapper">{children}</div>;
}
