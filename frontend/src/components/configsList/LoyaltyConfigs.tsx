import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_LOYALTY;

export default function LoyaltyConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ loyaltyConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigInput
        optionName="Interval check chatters delay"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...loyaltyConfigs,
              intervalCheckChatters: e.target.valueAsNumber,
            },
          })
        }
        value={loyaltyConfigs.intervalCheckChatters}
        showEdit={showEdit}
      />
    </>
  );
}
