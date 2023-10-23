import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Song, SongLikesAction, useGetUsersByIds } from "@services";

interface SongLikesProps {
  likes: Song["likes"];
}

enum SongLikesEnumActions {
  DISLIKED = -1,
  UNLIKED = 0,
  LIKED = 1,
}

interface MappedLikesType {
  userId: string;
  username: string;
  action: SongLikesAction;
}

export default function SongLikes({ likes }: SongLikesProps) {
  const { data, error, loading } = useGetUsersByIds(Object.keys(likes));
  const [showLikes, setShowLikes] = useState<string>("");
  const mappedLikes = useMemo<MappedLikesType[] | null>(() => {
    if (!data) return null;
    const likesEntries = Object.entries(likes);
    return data.data.map((user) => {
      const founded = likesEntries.find(([id]) => id === user._id);

      if (founded) {
        return {
          userId: user._id,
          username: user.twitchName || user.username,
          action: founded[1],
        };
      }

      return { userId: "", username: "", action: 0 };
    });
  }, [data, likes]);

  if (error || loading) return null;

  return (
    <div className="preview-song-modal-song-users-data">
      <div className="sort-wrapper">
        <div>Show: </div>
        <select onChange={(e) => setShowLikes(e.target.value)}>
          <option value=""> all </option>
          <option value={SongLikesEnumActions[1]}>
            {SongLikesEnumActions[1]}
          </option>
          <option value={SongLikesEnumActions[-1]}>
            {SongLikesEnumActions[-1]}
          </option>
          <option value={SongLikesEnumActions[0]}>
            {SongLikesEnumActions[0]}
          </option>
        </select>
      </div>
      {mappedLikes
        ?.filter(({ action }) => {
          if (!showLikes) return true;
          if (showLikes === SongLikesEnumActions[action]) return true;

          return false;
        })
        .map(({ username, action, userId }, index) => (
          <div key={index} className="song-users-data-list">
            <div>
              <Link to={`/users/${userId}`} target="_blank">
                {username}
              </Link>
            </div>
            <div
              className={`${
                action === -1
                  ? "disliked-song"
                  : action === 0
                  ? "unliked-song"
                  : "liked-song"
              }`}
            >
              {SongLikesEnumActions[action]}
            </div>
          </div>
        ))}
    </div>
  );
}
