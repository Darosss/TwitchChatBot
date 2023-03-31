import "./style.css";

export default function CardboxWrapper(props: {
  title: string;
  children: React.ReactNode;
}) {
  const { title, children } = props;

  return (
    <div className="cardbox-wrapper">
      <div className="cardbox-header">{title}</div>
      <div className="cardbox-list">{children}</div>
    </div>
  );
}

export function CardboxItem(props: {
  title: string;
  children: React.ReactNode;
  onClickX: () => void | unknown;
}) {
  const { title, children, onClickX } = props;
  return (
    <>
      <div className="cardbox-item">
        <button
          onClick={onClickX}
          className="common-button danger-button remove-cardbox-btn"
        >
          X
        </button>
        <div className="cardbox-title">{title}</div>
        <div className="cardbox-content">{children}</div>
      </div>
    </>
  );
}

export function CardboxInput(props: {
  title: string;
  children: React.ReactNode;
}) {
  const { title, children } = props;
  return (
    <>
      <div className="cardbox-item cardbox-input">
        <div className="cardbox-title">{title}</div>
        <div className="cardbox-content">{children}</div>
      </div>
    </>
  );
}
