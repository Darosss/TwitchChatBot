import { Document } from "mongoose";
import { LayoutBreakpoint } from "../layouts";
import { BaseModel } from "../types";

export interface OverlayModel extends BaseModel {
  name: string;
  layout: { [P: string]: LayoutBreakpoint[] };
  toolbox: { [P: string]: LayoutBreakpoint[] };
  styles?: Map<string, string>;
}

export type OverlayDocument = OverlayModel & Document;
