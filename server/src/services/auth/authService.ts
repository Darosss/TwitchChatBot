import { AuthToken } from "@models/authModel";
import { AuthCreateData } from "./types";

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
    return newAuth;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create new auth");
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
    console.error(err);
    throw new Error("Failed to check if auth is valid");
  }
};

export const createOrGetIfAuthValid = async (createData: AuthCreateData) => {
  if (!(await checkIfAuthValid())) {
    return await createNewAuth(createData);
  }
  return (await getAuthToken())!;
};
