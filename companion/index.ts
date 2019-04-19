import { peerSocket } from "messaging";
import { settingsStorage } from "settings";
import { setDefaultSettings } from "../common/common-settings";
import { GoalType } from "../common/goal-type";
import { goalsOptions } from "../common/goals-options";
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
        key: evt.key as SettingsKeys,
        value: evt.newValue as string,
    },
  });
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    const key = settingsStorage.key(index);
    if (key) {
      sendVal({
        key: MessageKey.SETTING_CHANGED,
        value: {
            key: key as SettingsKeys,
            value: settingsStorage.getItem(key),
        },
      });
    }
  }
}

// Send data to device using Messaging API
function sendVal(data: Message) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(data);
  }
}
