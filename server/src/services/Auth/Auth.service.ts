import { AuthToken } from "@models/auth.model";
import { AuthCreateData } from "./types/Auth";

export const createNewAuth = async (createData: AuthCreateData) => {
  try {
    const newAuth = await AuthToken.create(createData);
    return newAuth;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create new auth");
  }
};
