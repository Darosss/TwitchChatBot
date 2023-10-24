import { User, useGetUsersList } from "@services";
import { useState } from "react";

interface SearchUsersProps {
  onClickUser: (user: User) => void;
}

export default function SearchUsers({ onClickUser }: SearchUsersProps) {
  const [searchName, setSearchName] = useState("");
  const [whoAdded, setWhoAdded] = useState<User | null>(null);

  const { data } = useGetUsersList(
    false,
    `search_name=${searchName}&limit=5&page=1`
  );

  return (
    <div className="search-users-wrapper">
      {whoAdded ? (
        <div className="who-added-wrapper">
          {whoAdded?.twitchName}
          <button className="danger-button" onClick={() => setWhoAdded(null)}>
            x
          </button>
        </div>
      ) : (
        <div>Search users</div>
      )}
      {!whoAdded ? (
        <div className="search-user-content-wrapper">
          <div>
            <input
              type="text"
              onBlur={({ target: { value } }) => setSearchName(value)}
              onKeyDown={(e) =>
                e.key === "Enter" ? setSearchName(e.currentTarget.value) : null
              }
            />
          </div>
          <div> Users: </div>
          <div className="users-list">
            {data?.data?.map((user, index) => (
              <button
                key={index}
                className="primary-button"
                onClick={() => {
                  onClickUser(user);
                  setWhoAdded(user);
                }}
              >
                {user.twitchName}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

//TODO: add whoAdded into localstorage?
