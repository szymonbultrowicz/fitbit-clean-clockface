import { GoalType } from "./goal-type";

export interface Config {
  enableGoals: boolean;
  enabledGoal: GoalType;
  enableBattery: boolean;
}

export const defaultConfig = {
  enableGoals: false,
  enabledGoal: GoalType.steps,
  enableBattery: false,
};

let internalConfig = {
  ...defaultConfig,
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
};
