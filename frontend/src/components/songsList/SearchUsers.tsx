import { User, useGetUsers } from "@services";
import { useState } from "react";

interface SearchUsersProps {
  onClickUser: (user: User) => void;
  value?: User | null;
  currentUserId?: string;
}

export default function SearchUsers({
  value = null,
  onClickUser,
  currentUserId,
}: SearchUsersProps) {
  const [searchName, setSearchName] = useState("");
  const [whoAdded, setWhoAdded] = useState<User | null>(value);

  const { data } = useGetUsers({ search_name: searchName, limit: 5, page: 1 });

  return (
    <div className="search-users-wrapper">
      {whoAdded ? (
        <div className="who-added-wrapper">
          {whoAdded.username}
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
                className={`${
                  currentUserId === user._id
                    ? "primary-button"
                    : "tertiary-button"
                }`}
                onClick={() => {
                  onClickUser(user);
                  setWhoAdded(user);
                }}
              >
                {user.username}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
