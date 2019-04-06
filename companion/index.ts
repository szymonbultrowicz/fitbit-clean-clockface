import { peerSocket } from "messaging";
import { settingsStorage } from "settings";
import { Message } from "../common/message";
import { Settings } from '../common/settings-keys';
import { GoalType } from '../common/goal-type';
import { goalsOptions } from '../common/goals-options';

setDefaultSettings();

// Message socket opens
peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    }
  }
}

// Send data to device using Messaging API
function sendVal(data: Message) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(data);
  }
}

function setDefaultSettings() {
    const enabledGoal = settingsStorage.getItem(Settings.ENABLED_GOAL);
    if (!enabledGoal) {
        settingsStorage.setItem(Settings.ENABLED_GOAL, JSON.stringify(goalsOptions.find(goal => goal.value === GoalType.steps)));
    }
}
