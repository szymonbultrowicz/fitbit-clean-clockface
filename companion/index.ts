import { peerSocket } from "messaging";
import { settingsStorage } from "settings";
import { SelectValue, setDefaultSettings } from "../common/common-settings";
import { Config } from "../common/config";
import { GoalType } from "../common/goal-type";
import { MessageKey } from "../common/message-keys";
import { Message } from "../common/messages";
import { SettingsKeys } from "../common/settings-keys";

setDefaultSettings(settingsStorage);

// Message socket opens
peerSocket.onopen = () => {
  restoreSettings();
};

// A user changes settings
settingsStorage.onchange = (evt) => {
  sendVal({
    key: MessageKey.SETTING_CHANGED,
    value: {
      [evt.key]: coerceSettingsValue(evt.key as SettingsKeys, evt.newValue),
    },
  });
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  const config: Partial<Config> = [...Array(settingsStorage.length).keys()]
    .map((i) => settingsStorage.key(i) as SettingsKeys)
    .filter((key) => !!key)
    .reduce((acc, key) => {
      const value = coerceSettingsValue(key, settingsStorage.getItem(key));
      return value
        ? {
            ...acc,
            ...{
              [key]: value,
            },
          }
        : acc;
    }, {});
  sendVal({
    key: MessageKey.SETTING_CHANGED,
    value: config,
  });
}

function coerceBoolean(value: string) {
  return value === "true";
}

function coerceSettingsValue(
  key: SettingsKeys,
  value: string,
): boolean | GoalType | null {
  switch (key) {
    case SettingsKeys.ENABLE_GOALS:
    case SettingsKeys.ENABLE_BATTERY:
      return coerceBoolean(value);
    case SettingsKeys.ENABLED_GOAL:
      const selectValue = JSON.parse(value) as SelectValue;
      if (selectValue.values.length === 1) {
        return selectValue.values[0].value;
      } else if (selectValue.selected.length > 0) {
        return selectValue.values[selectValue.selected[0]].value;
      }
      return undefined;
  }
  return undefined;
}

// Send data to device using Messaging API
function sendVal(data: Message) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(data);
  }
}
