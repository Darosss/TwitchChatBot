import { randomWithMax } from "@utils";
import moment from "moment";
import { commonData } from "../commonExampleData";
import { ObtainAchievementDataWithCollectedAchievement } from "@socket";
const simpleAchievementsNames = [
  "Masters of Multitasking",
  "Eternal Explorer",
  "Pixel Perfectionist",
  "Quantum Quasar",
  "Serenade Sorcerer",
  "Majestic Maven of Memes",
  "Galactic Gourmet Guru",
  "Abyssal Architect",
  "Pinnacle Puzzler",
  "Velocity Virtuoso",
  "Jungle Juggernaut",
  "Nebula Nomad",
  "Luminary Linguist",
  "Aerial Alchemist",
  "Chronicle Champion",
];

const simpleStageNames = [
  "Novice Trailblazer",
  "Apprentice Explorer",
  "Journeyman Adventurer",
  "Expert Pathfinder",
  "Adept Voyager",
  "Master Discoverer",
  "Elite Wayfarer",
  "Legendary Pioneer",
  "Grand Expeditionist",
  "Mythical Wanderer",
  "Celestial Nomad",
  "Epic Odyssey Master",
  "Infinity Quest Seeker",
  "Timeless Trekker",
  "Cosmic Conqueror",
];

const generateRandomObtainedAchievementData = (
  index: number
): ObtainAchievementDataWithCollectedAchievement => {
  return {
    id: Math.random().toString(),
    achievement: {
      isTime: Math.random() > 0.5 ? true : false,
      name: simpleAchievementsNames[
        randomWithMax(simpleAchievementsNames.length - 1)
      ],
    },
    stage: {
      timestamp: moment().add(index, "second").toDate().getTime(),
      data: {
        name: simpleStageNames[randomWithMax(simpleStageNames.length - 1)],
        stage: Math.floor(Math.random() * 20),
        goal: Math.floor(Math.random() * 1000000),
        badge: {
          id: Math.random(),
          name: "badge name",
          description: "badge description",
          imagesUrls: {
            x64: "\\achievements\\badges\\chat-message-100-xSize-64.png",
          },
        },
        showTimeMs: 2500,
        rarity: index % 9,
      },
    },
    username:
      commonData.nicknames[randomWithMax(commonData.nicknames.length - 1)],
  };
};

export const getExampleAchievementsData = (
  length = 15
): ObtainAchievementDataWithCollectedAchievement[] => {
  return Array(length)
    .fill(0)
    .map((val, index) => generateRandomObtainedAchievementData(index + 1));
};
