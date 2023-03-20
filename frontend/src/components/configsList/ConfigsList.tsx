import "./style.css";
import React, { useContext, useState } from "react";

import PreviousPage from "@components/previousPage";
import { getConfigs, editConfig } from "@services/ConfigService";
import { SocketContext } from "@context/SocketContext";
import { addNotification } from "@utils/getNotificationValues";

export default function ConfigsList() {
  const socket = useContext(SocketContext);

  const [showEdit, setShowEdit] = useState(false);

  const [prefix, setPrefix] = useState("");
  const [timersInterval, setTimersInterval] = useState<number>(50);
  const [activeUserTime, setActiveUserTime] = useState<number>(150);
  const [chatGamesInterval, setChatGamesInterval] = useState<number>(30);
  const [intervCheckChatters, setIntervalCheckChatters] = useState<number>(300);
  const [minActiveUsers, setMinActiveUsers] = useState<number>(4);
  const [intervCheckViewersPeek, setIntervalCheckViewersPeek] =
    useState<number>(600);
  const [randomMsgChance, setRandomMessageChance] = useState<number>(15);
  const [permissions, setPermissions] = useState({
    broadcaster: 10,
    mod: 8,
    vip: 4,
    all: 0,
  });
  const [ptsIncrement, setPointsIncrement] = useState({
    watch: 10,
    watchMultipler: 2,
    message: 1,
  });

  const { data, loading, error, refetchData } = getConfigs();

  const { refetchData: fetchEditConfig } = editConfig({
    commandsPrefix: prefix,
    timersIntervalDelay: timersInterval,
    activeUserTimeDelay: activeUserTime,
    chatGamesIntervalDelay: chatGamesInterval,
    minActiveUsersThreshold: minActiveUsers,
    permissionLevels: permissions,
    pointsIncrement: ptsIncrement,
    intervalCheckViewersPeek: intervCheckViewersPeek,
    randomMessageChance: randomMsgChance,
    intervalCheckChatters: intervCheckChatters,
  });

  const setConfigStates = () => {
    setPrefix(commandsPrefix);
    setTimersInterval(timersIntervalDelay);
    setActiveUserTime(activeUserTimeDelay);
    setChatGamesInterval(chatGamesIntervalDelay);
    setPointsIncrement(pointsIncrement);
    setIntervalCheckViewersPeek(intervalCheckViewersPeek);
    setIntervalCheckChatters(intervalCheckChatters);
    setRandomMessageChance(randomMessageChance);
    setMinActiveUsers(minActiveUsersThreshold);
    setPermissions(permissionLevels);
  };

  const onClickEditConfig = () => {
    setShowEdit(false);
    fetchEditConfig().then(() => {
      socket?.emit("saveConfigs");
      refetchData();
      addNotification("Succes", "Configs edited succesfully", "success");
    });
  };
  if (error) return <>There is an error.</>;
  if (!data || loading) return <>Someting went wrong</>;

  const {
    commandsPrefix,
    timersIntervalDelay,
    activeUserTimeDelay,
    chatGamesIntervalDelay,
    minActiveUsersThreshold,
    permissionLevels,
    intervalCheckViewersPeek,
    pointsIncrement,
    randomMessageChance,
    intervalCheckChatters,
  } = data;

  return (
    <>
      <PreviousPage />
      <button
        className="common-button primary-button"
        onClick={() => {
          setConfigStates();
          setShowEdit((prevState) => {
            return !prevState;
          });
        }}
      >
        Edit
      </button>
      {showEdit ? (
        <button
          className="common-button danger-button"
          onClick={() => onClickEditConfig()}
        >
          Save
        </button>
      ) : null}
      <div className="table-list-wrapper">
        <div>Chat commands prefix</div>
        <div>
          {showEdit ? (
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          ) : (
            commandsPrefix
          )}
        </div>
        <div>Check timers every</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={timersInterval}
              onChange={(e) => setTimersInterval(Number(e.target.value))}
            />
          ) : (
            timersIntervalDelay
          )}
        </div>
        <div>Active user max time</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={activeUserTime}
              onChange={(e) => setActiveUserTime(Number(e.target.value))}
            />
          ) : (
            activeUserTimeDelay
          )}
        </div>
        <div>Check chatters on chat every</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={intervCheckChatters}
              onChange={(e) => setIntervalCheckChatters(Number(e.target.value))}
            />
          ) : (
            intervalCheckChatters
          )}
        </div>
        <div>Interval check viewers peek</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={intervCheckViewersPeek}
              onChange={(e) =>
                setIntervalCheckViewersPeek(Number(e.target.value))
              }
            />
          ) : (
            intervalCheckViewersPeek
          )}
        </div>
        <div>Random message chance</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={randomMsgChance}
              onChange={(e) => setRandomMessageChance(Number(e.target.value))}
            />
          ) : (
            randomMessageChance
          )}
        </div>
        <div>Check chat games every</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={chatGamesInterval}
              onChange={(e) => setChatGamesInterval(Number(e.target.value))}
            />
          ) : (
            chatGamesIntervalDelay
          )}
        </div>
        <div>Minimum users to play chat game</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={minActiveUsers}
              onChange={(e) => setMinActiveUsers(Number(e.target.value))}
            />
          ) : (
            minActiveUsersThreshold
          )}
        </div>

        <div className="config-header">Permissions</div>
        <div>Broadcaster</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={permissions.broadcaster}
              onChange={(e) =>
                setPermissions((prevState) => ({
                  ...prevState,
                  broadcaster: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            permissionLevels.broadcaster
          )}
        </div>
        <div>Mod</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={permissions.mod}
              onChange={(e) =>
                setPermissions((prevState) => ({
                  ...prevState,
                  mod: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            permissionLevels.mod
          )}
        </div>
        <div>Vip</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={permissions.vip}
              onChange={(e) =>
                setPermissions((prevState) => ({
                  ...prevState,
                  vip: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            permissionLevels.vip
          )}
        </div>
        <div>All</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={permissions.all}
              onChange={(e) =>
                setPermissions((prevState) => ({
                  ...prevState,
                  all: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            permissionLevels.all
          )}
        </div>
        <div className="config-header">Points increment</div>
        <div>Message</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={ptsIncrement.message}
              onChange={(e) =>
                setPointsIncrement((prevState) => ({
                  ...prevState,
                  message: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            pointsIncrement.message
          )}
        </div>
        <div>Watch</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={ptsIncrement.watch}
              onChange={(e) =>
                setPointsIncrement((prevState) => ({
                  ...prevState,
                  watch: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            pointsIncrement.watch
          )}
        </div>
        <div>Watch multipler</div>
        <div>
          {showEdit ? (
            <input
              type="number"
              value={ptsIncrement.watchMultipler}
              onChange={(e) =>
                setPointsIncrement((prevState) => ({
                  ...prevState,
                  watchMultipler: e.target.valueAsNumber,
                }))
              }
            />
          ) : (
            pointsIncrement.watchMultipler
          )}
        </div>
      </div>
    </>
  );
}
