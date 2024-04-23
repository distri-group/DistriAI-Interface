import { useState, useEffect } from "react";

function formatTime(time) {
  return `${time < 10 ? "0" : ""}${time}`;
}

function clearCountdownInfo(status) {
  return {
    day: 0,
    hours: 0,
    hoursStr: "00",
    minutes: 0,
    minutesStr: "00",
    seconds: 0,
    secondsStr: "00",
    status: status || "end",
  };
}

function computeCountdownInfo(remainTime) {
  if (remainTime < 0) {
    return clearCountdownInfo();
  }
  const day = Math.floor(remainTime / (24 * 60 * 60));
  const hours = Math.floor((remainTime / (60 * 60)) % 24);
  const hoursStr = formatTime(hours);
  const minutes = Math.floor((remainTime / 60) % 60);
  const minutesStr = formatTime(minutes);
  const seconds = Math.floor(remainTime % 60);
  const secondsStr = formatTime(seconds);
  return {
    day,
    hours,
    hoursStr,
    minutes,
    minutesStr,
    seconds,
    secondsStr,
    status: "running",
  };
}

function useCountDown(deadlineTime, onEnd) {
  const [timeInfo, setTimeInfo] = useState(clearCountdownInfo("pending"));

  useEffect(() => {
    let timer;
    function countdown() {
      const nowTime = Date.now();
      const remainTime = (deadlineTime - nowTime) / 1000;
      const data = computeCountdownInfo(remainTime);
      setTimeInfo(data);
      if (remainTime > 0) {
        timer = setTimeout(countdown, 1000);
      } else {
        if (typeof onEnd === "function") {
          onEnd();
          clearTimeout(timer);
        }
      }
    }
    countdown();
    return () => {
      clearTimeout(timer);
    };
  }, [deadlineTime]);

  return timeInfo;
}

export default useCountDown;
