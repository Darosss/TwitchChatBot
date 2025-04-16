import { useDispatch, useSelector } from "react-redux";
import ConfigInput from "./ConfigInput";
import { RootStore } from "@redux/store";
import { setLoyaltyConfigs } from "@redux/configsSlice";

export default function LoyaltyConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { loyaltyConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Interval check chatters delay"
        setState={(e) =>
          dispatch(
            setLoyaltyConfigs([
              "intervalCheckChatters",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={loyaltyConfigs.intervalCheckChatters}
        showEdit={isUpdateMode}
      />
    </>
  );
}
