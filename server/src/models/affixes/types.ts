import { BaseModel, PrefixSuffixChancesConfig } from "../types";
import { Document } from "mongoose";

export interface AffixModel extends BaseModel, PrefixSuffixChancesConfig {
  name: string;
  enabled: boolean;
  prefixes: string[];
  suffixes: string[];
  prefixChance: number;
  suffixChance: number;
}

export type AffixDocument = AffixModel & Document;
