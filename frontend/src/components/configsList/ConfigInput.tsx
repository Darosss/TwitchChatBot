interface ConfigInputProps {
  optionName: string;
  setState: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  showEdit: boolean;
  inputType?: React.HTMLInputTypeAttribute;
}

export default function ConfigInput({
  optionName,
  setState,
  value,
  showEdit = false,
  inputType = "number",
}: ConfigInputProps) {
  return (
    <>
      <div> {optionName} </div>
      <div>
        {showEdit ? (
          <input
            type={inputType}
            value={String(value)}
            onChange={(e) => setState(e)}
          />
        ) : (
          String(value)
        )}
      </div>
    </>
  );
}
