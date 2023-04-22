import { LoyaltyConfigs } from "@services/ConfigService";
import ConfigInput from "./ConfigInput";
export default function LoyaltyConfigsWrapper(props: {
  loyaltyState: [
    LoyaltyConfigs,
    React.Dispatch<React.SetStateAction<LoyaltyConfigs>>
  ];
  showEdit: boolean;
}) {
  const { loyaltyState, showEdit } = props;
  const [loyaltyConfigs, setLoyaltyConfigs] = loyaltyState;
  return (
    <>
      <ConfigInput
        optionName="Interval check chatters delay"
        setState={(e) =>
          setLoyaltyConfigs((prevState) => ({
            ...prevState,
            intervalCheckChatters: e.target.valueAsNumber,
          }))
        }
        value={loyaltyConfigs.intervalCheckChatters}
        showEdit={showEdit}
      />
    </>
  );
}
