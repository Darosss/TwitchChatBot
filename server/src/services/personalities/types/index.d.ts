import { PersonalityModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface PersonalityFindOptions {
  select?: SelectQuery<PersonalityModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyPersonalitiesFindOptions extends PersonalityFindOptions {
  sort?: SortQuery<PersonalityModel> | {};
  skip?: number;
  limit?: number;
}

export interface PersonalityCreateData
  extends Pick<PersonalityModel, "name">,
    PersonalityOptionalData {}

export interface PersonalityUpdateData
  extends Partial<Pick<PersonalityModel, "name" | "enabled">> {}
