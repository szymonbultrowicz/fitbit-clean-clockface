import { me } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import clock from "clock";
import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { peerSocket } from "messaging";
import { battery } from "power";
import { preferences } from "user-settings";
import { Config, config } from "../common/config";
import { formatDate, zeroPad } from "../common/date";
import { GoalType } from "../common/goal-type";
import { MessageKey } from "../common/message-keys";
import { Message } from "../common/messages";
import { formatNumber } from "../common/numbers";
import { goal } from "./daily-goal";
import { load as loadConfig, save as saveConfig } from "./local-config";

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

let hrmReadingTimeout = 0;

config.update(loadConfig());

peerSocket.onmessage = (evt) => {
  const data = evt.data as Message;

  if (data.key === MessageKey.SETTING_CHANGED) {
    settingChanged(data.value as Partial<Config>);
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
      clearTimeout(hrmReadingTimeout);
      if (config.hrTimeout > -1) {
        hrmReadingTimeout = setTimeout(() => {
          setText(hrLabel, "--");
        }, config.hrTimeout);
      }
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
    showBatteryStatus();
    displayGoal();
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
  setText(batteryLabel, config.enableBattery ? `${battery.chargeLevel}%` : "");
}

function changeGoal(goalType: GoalType) {
  goal.type = goalType;
  displayGoal();
}

function settingChanged(newConfig: Partial<Config>) {
  config.update(newConfig);
  changeGoal(config.enabledGoal);
  displayGoal();
  showBatteryStatus();
  saveConfig(config.state);
}
