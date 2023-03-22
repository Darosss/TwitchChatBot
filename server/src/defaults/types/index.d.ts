import { ConfigModel } from "@models/types";

export interface ConfigDefaults
  extends Omit<ConfigModel, "_id" | "createdAt" | "updatedAt"> {}
