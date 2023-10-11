interface CardboxCommonProps {
  title: string;
  children: React.ReactNode;
}

interface CardboxItemProps extends CardboxCommonProps {
  onClickX: () => void | unknown;
}

export default function CardboxWrapper({
  title,
  children,
}: CardboxCommonProps) {
  return (
    <div className="cardbox-wrapper">
      <div className="cardbox-header">{title}</div>
      <div className="cardbox-list">{children}</div>
    </div>
  );
}

export function CardboxItem({ title, children, onClickX }: CardboxItemProps) {
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

export function CardboxInput({ title, children }: CardboxCommonProps) {
  return (
    <>
      <div className="cardbox-item cardbox-input">
        <div className="cardbox-title">{title}</div>
        <div className="cardbox-content">{children}</div>
      </div>
    </>
  );
}
