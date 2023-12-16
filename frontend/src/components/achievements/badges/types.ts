import {
  Badge,
  BadgeCreateData,
  BadgeModelImagesUrls,
  PaginationData,
} from "@services";

export interface BadgesContextType {
  setBadgeIdToDelete: (value: string) => void;
  badgesState: PaginationData<Badge>;
  refetchBadgeData: () => Promise<void>;
}

export type BadgeStateType = BadgeCreateData & Pick<Badge, "_id">;

export interface BadgeContextEditCreateDataType {
  badgeState: [BadgeStateType, React.Dispatch<BadgeDispatchAction>];
  showModalState: [boolean, (value: boolean) => void];
}

export type BadgeDispatchAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_IMAGES_URLS"; payload: BadgeModelImagesUrls }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_STATE"; payload: BadgeStateType };
