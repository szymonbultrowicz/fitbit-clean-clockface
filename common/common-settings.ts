import { GoalType } from "./goal-type";
import { goalsOptions } from "./goals-options";
import { SettingsKeys } from "./settings-keys";

export interface SelectValue {
  selected: number[];
  values: SelectOption[];
}

function getGoalsSelection(value: GoalType): SelectValue {
  const selected = goalsOptions.findIndex((o) => o.value === value);
  return {
    selected: [selected],
    values: goalsOptions,
  };
}

function setDefaultSettingsValue(
  settingsStorage: LiveStorage,
  key: SettingsKeys,
  value: string,
) {
  const currentValue = settingsStorage.getItem(key);
  if (!currentValue) {
    settingsStorage.setItem(key, value);
  }
}

export function setDefaultSettings(settingsStorage: LiveStorage) {
  setDefaultSettingsValue(
    settingsStorage,
    SettingsKeys.ENABLED_GOAL,
    JSON.stringify(getGoalsSelection(GoalType.steps)),
  );
  setDefaultSettingsValue(settingsStorage, SettingsKeys.ENABLE_GOALS, "true");
  setDefaultSettingsValue(settingsStorage, SettingsKeys.ENABLE_BATTERY, "true");
}
