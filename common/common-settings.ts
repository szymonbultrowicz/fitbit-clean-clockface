import { stringifySettingsValue } from "../companion/coercion";
import { DEFAULT_CONFIG } from "./config";
import { GoalType } from "./goal-type";
import { SettingsKeys } from "./settings-keys";

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
  Object.keys(DEFAULT_CONFIG).forEach((key: SettingsKeys) => {
    setDefaultSettingsValue(
      settingsStorage,
      key,
      stringifySettingsValue(key, DEFAULT_CONFIG[key]),
    );
  });
}
