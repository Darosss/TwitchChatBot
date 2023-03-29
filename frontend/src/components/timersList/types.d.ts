import { TimerCreateData } from "@services/TimerService";

type DispatchAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_ENABLED"; payload?: boolean }
  | { type: "SET_DELAY"; payload: number }
  | { type: "SET_REQ_POINTS"; payload: number }
  | { type: "SET_NON_FOLLOW_MULTI"; payload?: boolean }
  | { type: "SET_NON_SUB_MULTI"; payload?: boolean }
  | { type: "SET_DESC"; payload: string }
  | { type: "SET_MESSAGES"; payload: string[] }
  | { type: "SET_TAG"; payload: string }
  | { type: "SET_PERSONALITY"; payload: string }
  | { type: "SET_MOOD"; payload: string }
  | { type: "SET_STATE"; payload: TimerCreateData };
