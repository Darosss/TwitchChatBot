import { InputHTMLAttributes } from "react";
import "react-modern-drawer/dist/index.css";

interface FilterBarInputProps extends InputHTMLAttributes<HTMLInputElement> {
  queryparam: string;
}

export default function FilterBarInput({
  queryparam,
  ...rest
}: FilterBarInputProps) {
  return <input {...{ queryparam: queryparam }} {...rest} />;
}
