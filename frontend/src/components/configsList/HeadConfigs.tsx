import ConfigInput from "./ConfigInput";
import { useConfigsContext } from "./ConfigsContext";
import { ConfigsDispatchActionType, ConfigsWrapperSharedProps } from "./types";

const DISPATCH_TYPE = ConfigsDispatchActionType.SET_HEAD;

export default function HeadConfigsWrapper({
  showEdit,
}: ConfigsWrapperSharedProps) {
  const {
    configState: [{ headConfigs }, dispatch],
  } = useConfigsContext();

  return (
    <>
      <ConfigInput
        optionName="Interval check viewers peek delay"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              intervalCheckViewersPeek: e.target.valueAsNumber,
            },
          })
        }
        value={headConfigs.intervalCheckViewersPeek}
        showEdit={showEdit}
      />
      <div className="configs-section-inner-header">
        Delay between messages in ms
      </div>
      <ConfigInput
        optionName="Min"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              delayBetweenMessages: {
                ...headConfigs.delayBetweenMessages,
                min: e.target.valueAsNumber,
              },
            },
          })
        }
        value={headConfigs.delayBetweenMessages.min}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Max"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              delayBetweenMessages: {
                ...headConfigs.delayBetweenMessages,
                max: e.target.valueAsNumber,
              },
            },
          })
        }
        value={headConfigs.delayBetweenMessages.max}
        showEdit={showEdit}
      />
      <div className="configs-section-inner-header">Permissions levels</div>
      <ConfigInput
        optionName="Broadcaster"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              permissionLevels: {
                ...headConfigs.permissionLevels,
                broadcaster: e.target.valueAsNumber,
              },
            },
          })
        }
        value={headConfigs.permissionLevels.broadcaster}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Mod"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              permissionLevels: {
                ...headConfigs.permissionLevels,
                mod: e.target.valueAsNumber,
              },
            },
          })
        }
        value={headConfigs.permissionLevels.mod}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="Vip"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              permissionLevels: {
                ...headConfigs.permissionLevels,
                vip: e.target.valueAsNumber,
              },
            },
          })
        }
        value={headConfigs.permissionLevels.vip}
        showEdit={showEdit}
      />
      <ConfigInput
        optionName="All"
        setState={(e) =>
          dispatch({
            type: DISPATCH_TYPE,
            payload: {
              ...headConfigs,
              permissionLevels: {
                ...headConfigs.permissionLevels,
                all: e.target.valueAsNumber,
              },
            },
          })
        }
        value={headConfigs.permissionLevels.all}
        showEdit={showEdit}
      />
    </>
  );
}
