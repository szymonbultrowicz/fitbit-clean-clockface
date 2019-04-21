import { readFileSync, writeFileSync } from "fs";
import { GoalType } from "./goal-type";

export interface Config {
  enableGoals: boolean;
  enabledGoal: GoalType;
  enableBattery: boolean;
}

export const DEFAULT_CONFIG = {
  enableGoals: false,
  enabledGoal: GoalType.steps,
  enableBattery: false,
};

const CONFIG_FILE_NAME = "config.json";

let internalConfig = {
  ...DEFAULT_CONFIG,
};

export const config = {
  get enableGoals() {
    return internalConfig.enableGoals;
  },

  get enabledGoal() {
    return internalConfig.enabledGoal;
  },

  get enableBattery() {
    return internalConfig.enableBattery;
  },

  update(newConfig: Partial<Config>) {
    internalConfig = {
      ...internalConfig,
      ...newConfig,
    };
  },

  save() {
    try {
      writeFileSync(CONFIG_FILE_NAME, internalConfig, "json");
    } catch (e) {
      console.error("Failed to save config file");
      console.error(e);
    }
  },

  restore() {
    try {
      internalConfig = {
        DEFAULT_CONFIG,
        ...readFileSync(CONFIG_FILE_NAME, "json"),
      };
    } catch (e) {
      console.error("Failed to read config file");
      console.error(e);
    }
  },
};
