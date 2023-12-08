import { BaseModelProperties } from "../api";

export interface Tag extends BaseModelProperties {
  name: string;
  enabled: boolean;
}

export interface TagCreateData extends Pick<Tag, "name"> {}

export interface TagUpdateData extends Partial<TagCreateData> {
  enabled?: boolean;
}
