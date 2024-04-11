import React from "react";
import useCountDown from "@/utils/useCountDown.js";

export default function Countdown({ deadlineTime }) {
  const timeInfo = useCountDown(deadlineTime);
  return (
    <>
      {timeInfo.day > 0 && <span>Days: {timeInfo.day}</span>}
      <span>
        {timeInfo.hoursStr}:{timeInfo.minutesStr}:{timeInfo.secondsStr}
      </span>
    </>
  );
}
