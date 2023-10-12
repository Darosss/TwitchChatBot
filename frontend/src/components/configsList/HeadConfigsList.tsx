import { ConfigsContextProvider } from "./ConfigsContext";
import ConfigsList from "./ConfigsList";

export default function HeadConfigsList() {
  return (
    <ConfigsContextProvider>
      <ConfigsList />
    </ConfigsContextProvider>
  );
}
