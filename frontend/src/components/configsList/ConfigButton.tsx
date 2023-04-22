export default function ConfigButton(props: {
  optionName: string;
  setState: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  value: Boolean;
  showEdit: boolean;
}) {
  const { optionName, setState, value, showEdit = false } = props;
  const button = () => {
    return (
      <button
        className={`common-button ${
          value ? "primary-button" : "danger-button"
        }`}
        onClick={(e) => setState(e)}
      >
        {String(value)}
      </button>
    );
  };

  return (
    <>
      <div> {optionName} </div>
      <div>{showEdit ? button() : String(value)}</div>
    </>
  );
}
