import { configureStore } from "@reduxjs/toolkit";
import songsReducer, { SongsSliceType } from "./songsSlice";
import affixesReducer, { AffixesSliceType } from "./affixesSlice";
import moodsReducer, { MoodsSliceType } from "./moodsSlice";
import tagsReducer, { TagsSliceType } from "./tagsSlice";
import commandsReducer, { ChatCommandsSliceType } from "./commandsSlice";
import configsReducer, { ConfigsSliceType } from "./configsSlice";
import messageCategoriesReducer, {
  MessageCategoriesSliceType,
} from "./messageCategoriesSlice";
import triggersReducer, { TriggersSliceType } from "./triggersSlice";
import timersReducer, { TimersSliceType } from "./timersSlice";
import overlaysReducer, { OverlaysSliceType } from "./overlaysSlice";
import rewardsReducer, { RewardsSliceType } from "./rewardsSlice";
import achievementsReducer, { AchievementSliceType } from "./achievementsSlice";
import badgesReducer, { BadgesSliceType } from "./badgesSlice";
import stagesReducer, { StagesSliceType } from "./stagesSlice";

export type RootStore = {
  achievements: AchievementSliceType;
  badges: BadgesSliceType;
  stages: StagesSliceType;
  songs: SongsSliceType;
  affixes: AffixesSliceType;
  moods: MoodsSliceType;
  tags: TagsSliceType;
  commands: ChatCommandsSliceType;
  configs: ConfigsSliceType;
  messageCategories: MessageCategoriesSliceType;
  triggers: TriggersSliceType;
  timers: TimersSliceType;
  overlays: OverlaysSliceType;
  rewards: RewardsSliceType;
};

export const store = configureStore({
  reducer: {
    achievements: achievementsReducer,
    badges: badgesReducer,
    stages: stagesReducer,
    songs: songsReducer,
    affixes: affixesReducer,
    moods: moodsReducer,
    tags: tagsReducer,
    commands: commandsReducer,
    configs: configsReducer,
    messageCategories: messageCategoriesReducer,
    triggers: triggersReducer,
    timers: timersReducer,
    overlays: overlaysReducer,
    rewards: rewardsReducer,
  },
});
