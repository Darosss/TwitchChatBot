import { BaseModel } from "../types";
import { Document } from "mongoose";

export interface BadgeModelImagesUrls {
  x32: string;
  x64: string;
  x96: string;
  x128: string;
}

export interface BadgeModel extends BaseModel {
  name: string;
  description: string;
  imagesUrls: BadgeModelImagesUrls;
}

export type BadgeDocument = BadgeModel & Document;
