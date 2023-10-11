import SortByParamsButton from "@components/SortByParamsButton";
import { DateTooltip } from "@components/dateTooltip";
import { User } from "@services/UserService";
import { Link } from "react-router-dom";

interface UsersDetailsProps {
  users: User[];
}

export default function UsersDetails({ users }: UsersDetailsProps) {
  return (
    <table id="table-users-list">
      <thead>
        <tr>
          <th>
            <SortByParamsButton buttonText="Username" sortBy="username" />
          </th>
          <th>Achievements</th>
          <th>
            <SortByParamsButton buttonText="Watch" sortBy="watchTime" />
          </th>
          <th>
            <SortByParamsButton buttonText="Last seen" sortBy="lastSeen" />
          </th>
          <th>
            <SortByParamsButton buttonText="Created" sortBy="createdAt" />
          </th>
          <th>
            <SortByParamsButton
              buttonText="Message count"
              sortBy="messageCount"
            />
          </th>
          <th>
            <SortByParamsButton buttonText="Points" sortBy="points" />
          </th>
        </tr>
      </thead>

      <tbody>
        {users.map(
          ({
            _id,
            username,
            lastSeen,
            createdAt,
            messageCount,
            points,
            watchTime,
          }) => {
            return (
              <tr key={_id}>
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
            );
          }
        )}
      </tbody>
    </table>
  );
}
