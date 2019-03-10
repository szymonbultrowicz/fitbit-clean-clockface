import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { zeroPad, formatDate } from "../common/date";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const hourLabel = document.getElementById("hour");
const minutesLabel = document.getElementById("minutes");
const hrLabel = document.getElementById("hr");
const dateLabel = document.getElementById("date");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  const today = evt.date;
  const hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  let mins = zeroPad(today.getMinutes());
  hourLabel.text = `${hours}`;
  minutesLabel.text = `${mins}`;
  dateLabel.text = formatDate(today);
}

const hrm = new HeartRateSensor();
hrm.onreading = () => {
  console.log(hrm.heartRate);
  hrLabel.text = `${hrm.heartRate}`;
};
if (display.on) {
  hrm.start();
}

display.onchange = () => {
  if (display.on) {
    hrm.start();
  } else {
    hrm.stop();
  }
};
