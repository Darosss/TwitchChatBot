import { ConfigModel } from "@models/types";

export type ConfigDefaults = Omit<ConfigModel, "_id" | "createdAt" | "updatedAt">;
