export default function ConfigInput(props: {
  optionName: string;
  setState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  showEdit: boolean;
  inputType?: React.HTMLInputTypeAttribute;
}) {
  const {
    optionName,
    setState,
    value,
    showEdit = false,
    inputType = "number",
  } = props;
  const input = () => {
    return (
      <input
        type={inputType}
        value={String(value)}
        onChange={(e) => setState(e)}
      />
    );
  };

  return (
    <>
      <div> {optionName} </div>
      <div>{showEdit ? input() : String(value)}</div>
    </>
  );
}
