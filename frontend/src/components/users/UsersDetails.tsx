import SortByParamsButton from "@components/SortByParamsButton";
import { DateTooltip } from "@components/dateTooltip";
import { User } from "@services";
import { Link } from "react-router-dom";

interface UsersDetailsProps {
  users: User[];
}

interface UserSortByDataType {
  buttonText: string;
  sortBy: keyof User;
}

export default function UsersDetails({ users }: UsersDetailsProps) {
  return (
    <table id="table-users-list">
      <thead>
        <tr>
          {userSortByData.map((data, index) => (
            <th key={index}>
              <SortByParamsButton
                buttonText={data.buttonText}
                sortBy={data.sortBy}
              />
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {users.map(
          (
            {
              _id,
              username,
              lastSeen,
              createdAt,
              messageCount,
              points,
              watchTime,
            },
            index
          ) => (
            <tr key={index}>
              <td className="users-list-username">
                <Link to={`./${_id}`}> {username}</Link>
              </td>
              <td className="users-list-achievements"></td>
              <td className="users-list-watch-time">
                {Math.floor(Number(watchTime) / 60)} min
              </td>
              <td className="users-list-date">
                {lastSeen ? (
                  <div className="users-list-date-div">
                    <DateTooltip date={lastSeen} />
                  </div>
                ) : null}
              </td>
              <td className="users-list-date">
                {createdAt ? (
                  <div className="users-list-date-div">
                    <DateTooltip date={createdAt} />
                  </div>
                ) : null}
              </td>
              <td className="users-list-message-count">
                {messageCount?.toLocaleString()}
              </td>
              <td className="users-list-points">
                {points ? Math.round(points) : null}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

const userSortByData: UserSortByDataType[] = [
  {
    buttonText: "Username",
    sortBy: "username",
  },
  {
    buttonText: "Achievements",
    sortBy: "_id", //TODO: when achievements will be added.
  },
  {
    buttonText: "Watch",
    sortBy: "watchTime",
  },
  {
    buttonText: "Last seen",
    sortBy: "lastSeen",
  },
  {
    buttonText: "Created at",
    sortBy: "createdAt",
  },
  {
    buttonText: "Messages count",
    sortBy: "messageCount",
  },
  {
    buttonText: "Points",
    sortBy: "points",
  },
];
