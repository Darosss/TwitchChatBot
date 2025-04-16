import { BaseModelProperties, DefaultRequestParams } from "../api";

export interface Tag extends BaseModelProperties {
  name: string;
  enabled: boolean;
}

export interface TagCreateData extends Pick<Tag, "name" | "enabled"> {}

export interface TagUpdateData extends Partial<TagCreateData> {
  enabled?: boolean;
}

export interface FetchTagParams extends DefaultRequestParams<keyof Tag> {
  search_name?: string;
}
