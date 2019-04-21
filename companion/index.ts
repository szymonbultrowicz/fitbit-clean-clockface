import { peerSocket } from "messaging";
import { settingsStorage } from "settings";

import { setDefaultSettings } from "../common/common-settings";
import { Config } from "../common/config";
import { MessageKey } from "../common/message-keys";
import { Message } from "../common/messages";
import { SettingsKeys } from "../common/settings-keys";
import { coerceSettingsValue } from "./coercion";

setDefaultSettings(settingsStorage);

// Message socket opens
peerSocket.onopen = () => {
  restoreSettings();
};

// A user changes settings
settingsStorage.onchange = (evt) => {
  sendConfigChanged({
    [evt.key]: coerceSettingsValue(evt.key as SettingsKeys, evt.newValue),
  });
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  sendConfigChanged(configFromStorage());
}

function sendConfigChanged(config: Partial<Config>) {
  sendVal({
    key: MessageKey.SETTING_CHANGED,
    value: config,
  });
}

function configFromStorage(): Partial<Config> {
  return [...Array(settingsStorage.length).keys()]
    .map((i) => settingsStorage.key(i) as SettingsKeys)
    .filter((key) => !!key)
    .map((key) => {
      const value = coerceSettingsValue(key, settingsStorage.getItem(key));
      return value ? { [key]: value } : {};
    })
    .reduce(mergeObj, {});
}

function mergeObj<T extends {}, U extends {}>(o1: T, o2: U): U & T {
  return {
    ...o1,
    ...o2,
  };
}

// Send data to device using Messaging API
function sendVal(data: Message) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(data);
  }
}
