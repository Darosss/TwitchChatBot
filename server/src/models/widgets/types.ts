import { Document } from "mongoose";
import { BaseModel } from "../types";
import { LayoutBreakpoint } from "../layouts";

export interface WidgetsModel extends BaseModel {
  name: string;
  layout: { [P: string]: LayoutBreakpoint[] };
  toolbox: { [P: string]: LayoutBreakpoint[] };
}

export type WidgetsDocument = WidgetsModel & Document;
