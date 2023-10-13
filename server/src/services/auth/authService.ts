import { AuthToken } from "@models";
import { AuthCreateData } from "./types";
import { AppError, handleAppError, logger, checkExistResource } from "@utils";

export const getAuthToken = async () => {
  try {
    const auth = await AuthToken.findOne({});
    return auth;
  } catch (err) {
    logger.error(`Error occured while getting auth token. ${err}`);
    handleAppError(err);
  }
};
export const createNewAuth = async (createData: AuthCreateData) => {
  try {
    const newAuth = await AuthToken.create(createData);

    if (!newAuth) {
      throw new AppError(400, "Couldn't create new auth");
    }
    return newAuth;
  } catch (err) {
    logger.error(`Failed to create new auth:  ${err}`);
    handleAppError(err);
  }
};

export const removeAuthToken = async () => {
  try {
    const deletedAuthToken = await AuthToken.findOneAndRemove();

    const authToken = checkExistResource(deletedAuthToken, `Auth token not found`);

    return authToken;
  } catch (err) {
    logger.error(`Error occured while trying to remove auth token. ${err}`);
    handleAppError(err);
  }
};
