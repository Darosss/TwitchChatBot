import { useState, useMemo } from "react";
import { Song, useGetUsersByIds } from "@services";
import { Link } from "react-router-dom";

interface UsersUsesProps {
  uses: Song["usersUses"];
}

interface MappedUserUsesType {
  userId: string;
  username: string;
  uses: number;
}

export default function SongUsersUses({ uses }: UsersUsesProps) {
  const { data, error, loading } = useGetUsersByIds(Object.keys(uses));
  const [sortDescending, setSortDescending] = useState(true);
  const mappedUsersUses = useMemo<MappedUserUsesType[] | null>(() => {
    if (!data) return null;
    const likesEntries = Object.entries(uses);
    return data.data.map((user) => {
      const founded = likesEntries.find(([id]) => id === user._id);

      if (founded) {
        return {
          userId: user._id,
          username: user.twitchName || user.username,
          uses: founded[1],
        };
      }

      return { userId: "", username: "", uses: 0 };
    });
  }, [data, uses]);

  if (error || loading) return null;

  return (
    <div className="preview-song-modal-song-users-data">
      <div className="sort-wrapper">
        <div>Sort: </div>
        <button
          className="primary-button"
          onClick={() => setSortDescending(!sortDescending)}
        >
          {sortDescending ? "↑" : "↓"}
        </button>
      </div>
      {mappedUsersUses
        ?.sort((a, b) => {
          if (sortDescending) return b.uses - a.uses;
          return a.uses - b.uses;
        })
        .map(({ username, userId, uses }, index) => (
          <div key={index} className="song-users-data-list">
            <div>
              <Link to={`/users/${userId}`} target="_blank">
                {username}
              </Link>
            </div>
            <div>{uses}</div>
          </div>
        ))}
    </div>
  );
}
