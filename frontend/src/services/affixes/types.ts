import { BaseModelProperties } from "../api";

export interface Affix extends BaseModelProperties {
  name: string;
  enabled: boolean;
  prefixChance: number;
  suffixChance: number;
  suffixes: string[];
  prefixes: string[];
}

export interface AffixCreateData extends Pick<Affix, "name"> {}

export interface AffixUpdateData
  extends Partial<AffixCreateData>,
    Partial<
      Pick<
        Affix,
        "prefixChance" | "suffixChance" | "prefixes" | "suffixes" | "enabled"
      >
    > {}
