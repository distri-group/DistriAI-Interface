import React from "react";
import useCountDown from "@/utils/useCountDown.js";

export default function Countdown({ deadlineTime, onEnd }) {
  const timeInfo = useCountDown(deadlineTime, onEnd);
  return (
    <>
      {timeInfo.day > 0 && <span>Days: {timeInfo.day}</span>}
      <span
        style={{
          color: timeInfo.day <= 0 && timeInfo.hours <= 0 ? "#ff6073" : "white",
        }}>
        {timeInfo.hoursStr}:{timeInfo.minutesStr}:{timeInfo.secondsStr}
      </span>
    </>
  );
}
