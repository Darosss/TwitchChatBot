import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Affix {
  _id: string;
  name: string;
  enabled: boolean;
  prefixChance: number;
  suffixChance: number;
  suffixes: string[];
  prefixes: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AffixCreateData extends Pick<Affix, "name"> {}

interface AffixUpdateData
  extends Partial<AffixCreateData>,
    Partial<
      Pick<Affix, "prefixChance" | "suffixChance" | "prefixes" | "suffixes">
    > {}

export const getAffixes = (urlParams = true) => {
  return useAxiosCustom<PaginationData<Affix>>({
    url: `/affixes`,
    urlParams: urlParams,
  });
};

export const editAffix = (id: string, data: AffixUpdateData) => {
  return useAxiosCustom<Affix>({
    url: `/affixes/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createAffix = (data: AffixCreateData) => {
  return useAxiosCustom<Affix>({
    url: `/affixes/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteAffix = (id: string) => {
  return useAxiosCustom<Affix>({
    url: `/affixes/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
