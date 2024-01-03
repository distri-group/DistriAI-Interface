import _ from "lodash";

/**
 * formatter file size
 * @param bytes
 */
const formatterSize = (bytes) => {
  if (_.isString(bytes)) {
    bytes = _.toNumber(bytes);
  }
  if (bytes === 0) return "0 B";
  let k = 1024;
  let sizeStr = ["iB", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]; //store
  let i = 0;
  for (let l = 0; l < 8; l++) {
    if (bytes / Math.pow(k, l) < 1) {
      break;
    }
    i = l;
  }
  return (bytes / Math.pow(k, i)).toFixed(3) + " " + sizeStr[i];
};

/**
 * formatter file size from mb
 * @param bytes
 */
const formatterSizeFromMB = (bytes) => {
  if (_.isString(bytes)) {
    bytes = _.toNumber(bytes);
  }
  if (bytes === 0) return "0 MiB";
  let k = 1024; //set base size
  let sizeStr = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]; //size
  let i = 0; //Unit subscript and power
  for (let l = 0; l < 6; l++) {
    if (bytes / Math.pow(k, l) < 1) {
      break;
    }
    i = l;
  }
  return (bytes / Math.pow(k, i)).toFixed(3) + " " + sizeStr[i];
};
const formatterSizeFromMBToGB = (bytes) => {
  if (_.isString(bytes)) {
    bytes = _.toNumber(bytes);
  }
  let g = 1024 * 1024 * 1024;
  return (bytes / g).toFixed(3);
};

/**
 * formatter coin
 * @param coin
 */
const formatterCurrency = (coin) => {
  if (_.isString(coin)) {
    coin = _.toNumber(coin);
  }
  if (coin === 0) return { money: "0", suffix: "TCESS" };
  let k = 1000;
  let currencyStr = [
    "PICO",
    "NANO",
    "MICRO",
    "MILLI",
    "TCESS",
    "KILO",
    "MILL",
    "BILL",
  ];
  let i = 0;
  for (let l = 0; l < 8; l++) {
    if (coin / Math.pow(k, l) < 1) {
      break;
    }
    i = l;
  }
  return { money: (coin / Math.pow(k, i)).toFixed(3), suffix: currencyStr[i] };
};
const formatterCurrencyMill = (coin) => {
  if (_.isString(coin)) {
    coin = _.toNumber(coin);
  }
  if (coin === 0) return 0;
  coin = coin / 1000000000000000000;
  return coin.toFixed(4);
};
/**
 * formatter coin
 * @param coin
 */
const formatterCurrencyStr = (coin) => {
  if (_.isString(coin)) {
    coin = _.toNumber(coin);
  }
  if (coin === 0) return "0 TCESS";
  let k = 1000;
  let currencyStr = [
    "PICO",
    "NANO",
    "MICRO",
    "MILLI",
    "TCESS",
    "KILO",
    "MILL",
    "BILL",
  ]; //convert
  let i = 0;
  for (let l = 0; l < 8; l++) {
    if (coin / Math.pow(k, l) < 1) {
      break;
    }
    i = l;
  }
  return `${(coin / Math.pow(k, i)).toFixed(3)} ${currencyStr[i]}`;
};
const formatterCurrencyStr2 = (coin) => {
  if (_.isString(coin)) {
    coin = _.toNumber(coin);
  }
  if (coin === 0) return 0;
  coin = coin / 1000000000000;
  coin = Math.round(coin * 100) / 100;
  coin = coin.toLocaleString("zh", { style: "decimal" });
  return coin;
};

/**
 * check is json
 * @param str
 */
const isJson = (str) => {
  let isValid = true;
  if (typeof str == "string") {
    try {
      let obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
      } else {
        isValid = false;
      }
    } catch (e) {
      console.log("error：" + str + "!!!" + e);
      isValid = false;
    }
  }
  return isValid;
};

const formatterTime = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

const getDateDiff = (timeStamp) => {
  const min = 1000 * 60;
  const hour = min * 60;
  const day = hour * 24;
  const week = day * 7;
  const now = new Date().getTime();
  const diff = now - timeStamp;
  console.log(diff);
  if (diff < 0 || diff < min) {
    return "JUST NOW";
  } else if (diff < hour) {
    return `${parseInt(diff / min)} MIN AGO`;
  } else if (diff < day) {
    return `${parseInt(diff / hour)} HOUR AGO`;
  } else if (diff < week) {
    return `${parseInt(diff / day)} DAY AGO`;
  } else {
    return new Date(timeStamp).toLocaleString();
  }
};

export {
  formatterSize,
  formatterSizeFromMB,
  formatterSizeFromMBToGB,
  formatterCurrency,
  formatterCurrencyMill,
  formatterCurrencyStr,
  formatterCurrencyStr2,
  isJson,
  formatterTime,
  getDateDiff,
};
