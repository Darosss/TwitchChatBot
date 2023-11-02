import { BadgeCreateData } from "@services";

export const getDefaultBadgeData = (): BadgeCreateData => {
  return {
    name: "DEFAULT_BADGE",
    description: "Default badge for every default achievement stages. Create some on your own.",
    imageUrl: "/"
  };
};
