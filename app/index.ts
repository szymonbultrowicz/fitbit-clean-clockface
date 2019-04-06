import { me } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import clock from "clock";
import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { preferences } from "user-settings";

import { formatDate, zeroPad } from "../common/date";
import { formatNumber } from "../common/numbers";
import { GoalType } from "../common/goal-type";
import { goal } from "./daily-goal";


// Update the clock every minute
clock.granularity = "minutes";

const hrm: HeartRateSensor | null = me.permissions.granted("access_heart_rate") ? new HeartRateSensor() : null;
const bodyPresenceSensor: BodyPresenceSensor | null = me.permissions.granted("access_activity") ? new BodyPresenceSensor : null;
goal.type = GoalType.steps;

// Get a handle on the <text> element
const hourLabel = document.getElementById("hour");
const minutesLabel = document.getElementById("minutes");
const hrLabel = document.getElementById("hr");
const dateLabel = document.getElementById("date");
const batteryLabel = document.getElementById("battery");
const goalLabel = document.getElementById("goal");

const setText = (el: Element | null, text: string): void => {
  if (el !== null) {
    el.text = text;
  }
}

const displayGoal = () => {
  setText(goalLabel, formatNumber(goal.value));
};

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  const today = evt.date;
  let hours: string;;
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = `${today.getHours() % 12 || 12}`;
  } else {
    // 24h format
    hours = zeroPad(today.getHours());
  }
  let mins = zeroPad(today.getMinutes());
  setText(hourLabel, `${hours}`);
  setText(minutesLabel, `${mins}`);
  setText(dateLabel, formatDate(today));
  
  displayGoal();
}

const startSensor = (sensor: Sensor<SensorReading> | null): void => {
  if (sensor !== null) {
    sensor.start();
  }
}

const stopSensor = (sensor: Sensor<SensorReading> | null): void => {
  if (sensor !== null) {
    sensor.stop();
  }
}

if (hrm !== null) {
  hrm.onreading = () => {
    console.log(hrm.heartRate);
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

setText(batteryLabel, `${battery.chargeLevel}%`);
battery.onchange = () => {
  setText(batteryLabel, `${battery.chargeLevel}%`);
};