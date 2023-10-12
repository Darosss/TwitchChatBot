import { TriggerCreateData, TriggerMode } from "@services";

export type DispatchAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_CHANCE"; payload: number }
  | { type: "SET_ENABLED"; payload?: boolean }
  | { type: "SET_DELAY"; payload: number }
  | { type: "SET_MESSAGES"; payload: string[] }
  | { type: "SET_WORDS"; payload: string[] }
  | { type: "SET_MODE"; payload: TriggerMode }
  | { type: "SET_TAG"; payload: string }
  | { type: "SET_MOOD"; payload: string }
  | { type: "SET_STATE"; payload: TriggerCreateData };
