import { IConfig } from "@models/types";

export interface IConfigDefaults
  extends Omit<IConfig, "_id" | "createdAt" | "updatedAt"> {}
