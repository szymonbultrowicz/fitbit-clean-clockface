import { me } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import clock from "clock";
import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { peerSocket } from "messaging";
import { battery } from "power";
import { preferences } from "user-settings";

import { formatDate, zeroPad } from "../common/date";
import { GoalType } from "../common/goal-type";
import { MessageKey } from "../common/message-keys";
import { Message, SettingChangeMessage } from "../common/messages";
import { formatNumber } from "../common/numbers";

import { SelectValue } from "../common/common-settings";
import { SettingsKeys } from "../common/settings-keys";
import { getSetting, setSetting } from "./app-settings";
import { goal, Goal } from "./daily-goal";

// Update the clock every minute
clock.granularity = "minutes";

const hrm: HeartRateSensor | null = me.permissions.granted("access_heart_rate")
  ? new HeartRateSensor()
  : null;
const bodyPresenceSensor: BodyPresenceSensor | null = me.permissions.granted(
  "access_activity",
)
  ? new BodyPresenceSensor()
  : null;
goal.type = GoalType.steps;

// Get a handle on the <text> element
const canvas: Element = document.getElementById("canvas");
const hourLabel = document.getElementById("hour");
const minutesLabel = document.getElementById("minutes");
const hrLabel = document.getElementById("hr");
const dateLabel = document.getElementById("date");
const batteryLabel = document.getElementById("battery");
const goalLabel = document.getElementById("goal-value");

peerSocket.onmessage = (evt) => {
  const data = evt.data as Message;

  if (data.key === MessageKey.SETTING_CHANGED) {
    const settingChangedMsg = data.value as SettingChangeMessage;
    settingChanged(settingChangedMsg.key, settingChangedMsg.value);
  }
};

const setText = (el: Element | null, text: string): void => {
  if (el !== null) {
    el.text = text;
  }
};

const displayGoal = () => {
  Object.keys(GoalType).forEach((t) => {
    const el = document.getElementsByClassName(
      "goal-icon-" + GoalType[t as (keyof typeof GoalType)],
    )[0];
    if (el) {
      (el as any).style.display = "none";
    }
  });

  if (goal.enabled) {
    setText(goalLabel, formatNumber(goal.value));
    (document.getElementsByClassName(
      "goal-icon-" + goal.type,
    )[0] as any).style.display = "inline";
  } else {
    setText(goalLabel, "");
  }
};

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  const today = evt.date;
  let hours: string;
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = `${today.getHours() % 12 || 12}`;
  } else {
    // 24h format
    hours = zeroPad(today.getHours());
  }
  const mins = zeroPad(today.getMinutes());
  setText(hourLabel, `${hours}`);
  setText(minutesLabel, `${mins}`);
  setText(dateLabel, formatDate(today));

  displayGoal();
};

const startSensor = (sensor: Sensor<SensorReading> | null): void => {
  if (sensor !== null) {
    sensor.start();
  }
};

const stopSensor = (sensor: Sensor<SensorReading> | null): void => {
  if (sensor !== null) {
    sensor.stop();
  }
};

if (hrm !== null) {
  hrm.onreading = () => {
    if (bodyPresenceSensor === null || bodyPresenceSensor.present) {
      setText(hrLabel, `${hrm.heartRate}`);
    }
  };
  if (display.on) {
    startSensor(hrm);
  }
}

if (bodyPresenceSensor !== null) {
  bodyPresenceSensor.onreading = () => {
    if (!bodyPresenceSensor.present) {
      setText(hrLabel, "--");
    }
  };
  if (display.on) {
    bodyPresenceSensor.start();
  }
}

display.onchange = () => {
  if (display.on) {
    startSensor(hrm);
    startSensor(bodyPresenceSensor);
  } else {
    stopSensor(hrm);
    setText(hrLabel, "--");
    stopSensor(bodyPresenceSensor);
  }
};

showBatteryStatus();
battery.onchange = () => {
  showBatteryStatus();
};

function showBatteryStatus() {
  const batteryEnabled = getSetting(SettingsKeys.ENABLE_BATTERY) !== "false";
  setText(batteryLabel, batteryEnabled ? `${battery.chargeLevel}%` : "");
}

function changeGoal(selectValue: SelectValue) {
  if (selectValue.values.length === 1) {
    goal.type = selectValue.values[0].value;
  } else if (selectValue.selected.length === 1) {
    goal.type = selectValue.values[selectValue.selected[0]].value as GoalType;
  }
  displayGoal();
}

function settingChanged(key: SettingsKeys, value: string) {
  switch (key) {
    case SettingsKeys.ENABLED_GOAL:
      changeGoal(JSON.parse(value) as SelectValue);
      break;
    case SettingsKeys.ENABLE_GOALS:
      goal.enabled = value === "true";
      displayGoal();
      break;
    case SettingsKeys.ENABLE_BATTERY:
      setSetting(key, value);
      showBatteryStatus();
      break;
  }
}
