import Modal from "@components/modal";
import SelectWithData from "@components/selectWithData";
import { AchievementsSearchParams, useGetAchievements } from "@services";
import { AddAchievementProgressToUserData, useSocketContext } from "@socket";
import { addNotification } from "@utils";
import React, { useCallback, useEffect, useState } from "react";

interface UserAchievementProgressProps {
  userId: string;
  username: string;
}

export default function UserAchievementProgress({
  userId,
  username,
}: UserAchievementProgressProps) {
  const {
    emits: { addAchievementProgressToUser },
  } = useSocketContext();
  const [showModal, setShowModal] = useState(true);
  const [addProgressData, setAddProgressData] =
    useState<AddAchievementProgressToUserData>({
      achievementName: "",
      progress: { value: 1, increment: true },
      userId: userId,
      username: "",
    });

  const [getAchievementsSearchParams, setGetAchievementsSearchParams] =
    useState<AchievementsSearchParams>();
  const {
    data: achievementsData,
    loading,
    error,
  } = useGetAchievements(getAchievementsSearchParams);

  const onChangePagination = useCallback(
    (page: number, size: number) =>
      setGetAchievementsSearchParams({
        ...getAchievementsSearchParams,
        page,
        limit: size,
      }),
    [getAchievementsSearchParams]
  );

  useEffect(() => {
    if (achievementsData)
      setAddProgressData((prevState) => ({
        ...prevState,
        achievementName: achievementsData.data.at(0)?.name || "",
      }));
  }, [achievementsData]);

  if (error)
    return (
      <>There is an error. {error.response?.data.message || error.message}</>
    );
  if (loading || !achievementsData) return <> Loading...</>;

  const handleOnClickAddUserProgress = () => {
    addAchievementProgressToUser(
      {
        username,
        userId,
        achievementName: addProgressData.achievementName,
        progress: addProgressData.progress,
      },
      (error) => {
        if (error)
          addNotification(
            "Error",
            `Couldn't add progress for user. ${error}`,
            "danger"
          );
        else {
          addNotification("Success", "Added progress for user", "default");
        }
      }
    );
  };
  const { currentPage, count, totalPages, data } = achievementsData;
  return (
    <>
      <button
        className="common-button primary-button"
        onClick={() => setShowModal(true)}
      >
        Add achievement progress
      </button>
      <Modal
        title="Add user achievement progress"
        onClose={() => setShowModal(false)}
        show={showModal}
        onSubmit={handleOnClickAddUserProgress}
      >
        <div className="add-user-achievement-progress-modal">
          <SelectWithData
            title="Choose achievement"
            data={data}
            defaultValue={addProgressData.achievementName}
            nameKey={"name"}
            valueKey={"name"}
            idKey={"_id"}
            searchName={getAchievementsSearchParams?.search_name || ""}
            onChangeSearchName={(name) =>
              setGetAchievementsSearchParams((prevState) => ({
                ...prevState,
                search_name: name,
                page: 1,
              }))
            }
            onChangeSelect={(e) =>
              setAddProgressData({
                ...addProgressData,
                achievementName: e.target.value,
              })
            }
            paginationData={{
              pageSize: getAchievementsSearchParams?.limit || 15,
              currentPage,
              totalCount: count,
              totalPages,
              onChangePagination,
            }}
          />
          <UserAchievementProgressValue
            values={addProgressData.progress}
            onChange={(value, increment) =>
              setAddProgressData({
                ...addProgressData,
                progress: {
                  value,
                  increment,
                },
              })
            }
          />
        </div>
      </Modal>
    </>
  );
}

interface UserAchievementProgressValueProps {
  values: { value: number; increment?: boolean };
  onChange: (value: number, increment?: boolean) => void;
}

function UserAchievementProgressValue({
  values,
  onChange,
}: UserAchievementProgressValueProps) {
  return (
    <div className="add-user-achievement-progress-value">
      <div>Progress</div>
      <div>
        <div>
          <label>
            <button
              className="common-button primary-button"
              onClick={(e) => onChange(values.value, !values.increment)}
            >
              {values.increment ? "Increment" : "Set"}
            </button>{" "}
            values {values.increment ? "by" : "to"}
          </label>
        </div>
        <div>
          <input
            type="number"
            value={values.value}
            min={1}
            onChange={(e) => {
              let localValue = e.target.valueAsNumber;
              if (localValue <= 0) localValue = 1;
              onChange(localValue, values.increment);
            }}
          />
        </div>
      </div>
    </div>
  );
}
