import { SettingsKeys } from "./settings-keys";
import { GoalType } from "./goal-type";

export interface Config {
  [SettingsKeys.ENABLE_GOALS]: boolean;
  [SettingsKeys.ENABLED_GOAL]: GoalType;
  [SettingsKeys.ENABLE_BATTERY]: boolean;
}
