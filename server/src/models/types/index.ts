export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrefixSuffixChancesConfig {
  suffixChance: number;
  prefixChance: number;
}
