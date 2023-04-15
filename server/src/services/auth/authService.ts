import { AuthToken } from "@models/authModel";
import { AuthCreateData } from "./types";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { checkExistResource } from "@utils/checkExistResourceUtil";

export const getAuthToken = async () => {
  try {
    const auth = await AuthToken.findOne({});
    return auth;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to find any auth");
  }
};
export const createNewAuth = async (createData: AuthCreateData) => {
  try {
    const newAuth = await AuthToken.create(createData);

    if (!newAuth) {
      throw new AppError(400, "Couldn't create chat commands");
    }
    return newAuth;
  } catch (err) {
    logger.error(`Failed to create new auth:  ${err}`);
    handleAppError(err);
  }
};

export const checkIfAuthValid = async () => {
  try {
    const auth = await getAuthToken();
    if (!auth) return false;
    const { expiresIn, obtainmentTimestamp } = auth;

    const newDate = new Date().getTime();
    const currentSeconds = (newDate - obtainmentTimestamp) / 1000;

    if (expiresIn > currentSeconds) return true;
    return false;
  } catch (err) {
    logger.error(`Failed to check if auth is valid:  ${err}`);
    handleAppError(err);
  }
};

export const removeAuthToken = async () => {
  try {
    const deletedAuthToken = await AuthToken.findOneAndRemove();

    const authToken = checkExistResource(
      deletedAuthToken,
      `Auth token not found`
    );

    return authToken;
  } catch (err) {
    logger.error("Failed to remove auth token");
    handleAppError(err);
  }
};

export const createOrGetIfAuthValid = async (createData: AuthCreateData) => {
  if (!(await checkIfAuthValid())) {
    return await createNewAuth(createData);
  }
  return (await getAuthToken())!;
};
