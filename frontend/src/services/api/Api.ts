import Axios, { AxiosError } from "axios";
import { viteBackendUrl } from "@configs/envVariables";
import { addNotification } from "@utils";
import { QueryClient } from "react-query";

export const customAxios = Axios.create({
  baseURL: viteBackendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export enum OnErrorHelperServiceAction {
  EDIT = "Edited",
  CREATE = "Created",
  DELETE = "Deleted",
  DUPLICATE = "Duplicated",
  INCREMENT_USES = "Incremented uses",
}
export enum OnErrorHelperServiceConcern {
  ACHIEVEMENT = "achievement",
  ACHIEVEMENT_STAGE = "achievement stage",
  ACHIEVEMENT_STAGE_SOUND = "achievement stage sound",
  BADGE = "achievement badge",
  BADGE_IMAGE = "achievement badge image",
  SONG = "song",
  AFFIX = "affix",
  COMMAND = "command",
  CONFIG = "config",
  FILE = "file",
  FOLDER = "folder",
  MESSAGE_CATEGORY = "message category",
  MOOD = "mood",
  OVERLAY = "overlay",
  STREAM_SESSION = "stream session",
  TAG = "tag",
  TIMER = "timer",
  TRIGGER = "trigger",
  USER = "user",
  WIDGET = "widget",
}

export const onErrorHelperService = (
  error: unknown,
  concern: OnErrorHelperServiceConcern,
  action: OnErrorHelperServiceAction,
  customDuration?: number
) => {
  const errorData = {
    messageError: "",
    messageCode: 400,
  };
  if (error instanceof AxiosError && error.response?.data) {
    errorData.messageError = error.response.data.message;
    errorData.messageCode = error.response.data.status || 400;
  } else if (error instanceof Error) {
    errorData.messageError = error.message;
  }

  addNotification(
    `${concern} couldn't be ${action.toLowerCase()}`,
    errorData.messageError
      ? `${errorData.messageCode}: ${errorData.messageError}`
      : ` ${concern} couldn't be ${action}`,
    "danger",
    customDuration || 8000
  );
};

export const refetchDataFunctionHelper = <
  QueryKeysType extends Record<string, string | ((...args: any[]) => string[])>,
  Key extends keyof QueryKeysType
>(
  queryStrings: QueryKeysType,
  queryKey: Key,
  queryClient: QueryClient,
  params: QueryKeysType[Key] extends (...args: any[]) => any[]
    ? Parameters<QueryKeysType[Key]>
    : null | undefined,
  exact = false
) => {
  const queryKeyValue = queryStrings[queryKey];

  const finalQueryKey =
    typeof queryKeyValue === "function"
      ? queryKeyValue(...(params || []))
      : queryKeyValue;

  return () =>
    queryClient.invalidateQueries({
      queryKey: finalQueryKey.toString(),
      exact,
    });
};
