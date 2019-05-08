import { readFileSync, writeFileSync } from "fs";
import { GoalType } from "./goal-type";
import { SettingsKeys } from "./settings-keys";

export interface Config {
  [SettingsKeys.ENABLE_GOALS]: boolean;
  [SettingsKeys.ENABLED_GOAL]: GoalType;
  [SettingsKeys.ENABLE_BATTERY]: boolean;
  [SettingsKeys.HR_TIMEOUT]: number;
}

export const DEFAULT_CONFIG: Config = {
  enableGoals: false,
  enabledGoal: GoalType.steps,
  enableBattery: false,
  hrTimeout: 60_000,
};

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

  get hrTimeout() {
    return internalConfig.hrTimeout;
  },

  update(newConfig: Partial<Config>) {
    internalConfig = {
      ...internalConfig,
      ...newConfig,
    };
  },

  get state() {
    return {
      ...internalConfig,
    };
  },
};
