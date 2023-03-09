import "./style.css";
import React, { useContext, useState } from "react";

import PreviousPage from "@components/previousPage";
import ConfigService from "@services/ConfigService";
import { SocketContext } from "@context/SocketContext";

export default function ConfigsList() {
  const socket = useContext(SocketContext);

  const [showEdit, setShowEdit] = useState(false);

  const [prefix, setPrefix] = useState("");
  const [timersInterval, setTimersInterval] = useState<number>();
  const [activeUserTime, setActiveUserTime] = useState<number>();
  const [chatGamesInterval, setChatGamesInterval] = useState<number>();
  const [intervCheckChatters, setIntervalCheckChatters] = useState<number>();
  const [minActiveUsers, setMinActiveUsers] = useState<number>();
  const [intervCheckViewersPeek, setIntervalCheckViewersPeek] =
    useState<number>();
  const [randomMsgChance, setRandomMessageChance] = useState<number>();
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

  const { data, loading, error, refetchData } = ConfigService.getConfigs();

  const { refetchData: fetchEditConfig } = ConfigService.editConfig({
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
        className="edit-config-button"
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
          className="edit-config-button"
          onClick={() => onClickEditConfig()}
        >
          Save
        </button>
      ) : null}
      <div className="table-list-wrapper">
        <table className="config-table">
          <tbody>
            <tr>
              <th colSpan={3}>Chat commands prefix</th>
              <td>
                {showEdit ? (
                  <input
                    type="text"
                    defaultValue={commandsPrefix}
                    onChange={(e) => setPrefix(e.target.value)}
                  />
                ) : (
                  commandsPrefix
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Check timers every</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={timersIntervalDelay}
                    onChange={(e) => setTimersInterval(Number(e.target.value))}
                  />
                ) : (
                  timersIntervalDelay
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Active user max time</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={activeUserTimeDelay}
                    onChange={(e) => setActiveUserTime(Number(e.target.value))}
                  />
                ) : (
                  activeUserTimeDelay
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Check chatters on chat every</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={intervalCheckChatters}
                    onChange={(e) =>
                      setIntervalCheckChatters(Number(e.target.value))
                    }
                  />
                ) : (
                  intervalCheckChatters
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Interval check viewers peek</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={intervalCheckViewersPeek}
                    onChange={(e) =>
                      setIntervalCheckViewersPeek(Number(e.target.value))
                    }
                  />
                ) : (
                  intervalCheckViewersPeek
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Random message chance</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={randomMessageChance}
                    onChange={(e) =>
                      setRandomMessageChance(Number(e.target.value))
                    }
                  />
                ) : (
                  randomMessageChance
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Check chat games every</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={chatGamesIntervalDelay}
                    onChange={(e) =>
                      setChatGamesInterval(Number(e.target.value))
                    }
                  />
                ) : (
                  chatGamesIntervalDelay
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Minimum users to play chat game</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={minActiveUsersThreshold}
                    onChange={(e) => setMinActiveUsers(Number(e.target.value))}
                  />
                ) : (
                  minActiveUsersThreshold
                )}
              </td>
            </tr>

            <tr>
              <th className="th-wide-col" colSpan={10}>
                Permissions
              </th>
            </tr>
            <tr>
              <th>Broadcaster</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={permissionLevels.broadcaster}
                    onChange={(e) =>
                      setPermissions((prevState) => {
                        prevState.broadcaster = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  permissionLevels.broadcaster
                )}
              </td>
              <th>Mod</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={permissionLevels.mod}
                    onChange={(e) =>
                      setPermissions((prevState) => {
                        prevState.mod = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  permissionLevels.mod
                )}
              </td>
              <th>Vip</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={permissionLevels.vip}
                    onChange={(e) =>
                      setPermissions((prevState) => {
                        prevState.vip = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  permissionLevels.vip
                )}
              </td>
              <th>All</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={permissionLevels.all}
                    onChange={(e) =>
                      setPermissions((prevState) => {
                        prevState.all = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  permissionLevels.all
                )}
              </td>
            </tr>
            <tr>
              <th className="th-wide-col" colSpan={10}>
                Points increment
              </th>
            </tr>
            <tr>
              <th>Message</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={pointsIncrement.message}
                    onChange={(e) =>
                      setPointsIncrement((prevState) => {
                        prevState.message = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  pointsIncrement.message
                )}
              </td>
              <th>Watch</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={pointsIncrement.watch}
                    onChange={(e) =>
                      setPointsIncrement((prevState) => {
                        prevState.watch = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  pointsIncrement.watch
                )}
              </td>
              <th>Watch multipler</th>
              <td>
                {showEdit ? (
                  <input
                    type="number"
                    defaultValue={pointsIncrement.watchMultipler}
                    onChange={(e) =>
                      setPointsIncrement((prevState) => {
                        prevState.watchMultipler = e.target.valueAsNumber;
                        return prevState;
                      })
                    }
                  />
                ) : (
                  pointsIncrement.watchMultipler
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
