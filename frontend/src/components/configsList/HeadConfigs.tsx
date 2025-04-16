import { useDispatch, useSelector } from "react-redux";
import ConfigInput from "./ConfigInput";
import { RootStore } from "@redux/store";
import { setHeadConfigs } from "@redux/configsSlice";

export default function HeadConfigsWrapper() {
  const dispatch = useDispatch();
  const {
    isUpdateMode,
    config: { headConfigs },
  } = useSelector((state: RootStore) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Interval check viewers peek delay"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "intervalCheckViewersPeek",
              e.currentTarget.valueAsNumber,
            ])
          )
        }
        value={headConfigs.intervalCheckViewersPeek}
        showEdit={isUpdateMode}
      />
      <div className="configs-section-inner-header">
        Delay between messages in ms
      </div>
      <ConfigInput
        optionName="Min"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "delayBetweenMessages",
              {
                ...headConfigs.delayBetweenMessages,
                min: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={headConfigs.delayBetweenMessages.min}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Max"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "delayBetweenMessages",
              {
                ...headConfigs.delayBetweenMessages,
                max: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={headConfigs.delayBetweenMessages.max}
        showEdit={isUpdateMode}
      />
      <div className="configs-section-inner-header">Permissions levels</div>
      <ConfigInput
        optionName="Broadcaster"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "permissionLevels",
              {
                ...headConfigs.permissionLevels,
                broadcaster: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={headConfigs.permissionLevels.broadcaster}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Mod"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "permissionLevels",
              {
                ...headConfigs.permissionLevels,
                mod: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={headConfigs.permissionLevels.mod}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="Vip"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "permissionLevels",
              {
                ...headConfigs.permissionLevels,
                vip: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={headConfigs.permissionLevels.vip}
        showEdit={isUpdateMode}
      />
      <ConfigInput
        optionName="All"
        setState={(e) =>
          dispatch(
            setHeadConfigs([
              "permissionLevels",
              {
                ...headConfigs.permissionLevels,
                all: e.currentTarget.valueAsNumber,
              },
            ])
          )
        }
        value={headConfigs.permissionLevels.all}
        showEdit={isUpdateMode}
      />
    </>
  );
}
