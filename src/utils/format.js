import _ from "lodash";
import { Tooltip, message, Progress } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import moment from "moment";
import copy from "copy-to-clipboard";
import AccountIcon from "../components/AccountIcon";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const formatterSizeFromMBToGB = (bytes) => {
  if (_.isString(bytes)) {
    bytes = _.toNumber(bytes);
  }
  let g = 1024 * 1024 * 1024;
  return (bytes / g).toFixed(3);
};

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
const formatterCurrencyStr = (coin) => {
  if (_.isString(coin)) {
    coin = _.toNumber(coin);
  }
  if (coin === 0) return 0;
  coin = coin / 1000000000000;
  coin = Math.round(coin * 100) / 100;
  coin = coin.toLocaleString("zh", { style: "decimal" });
  return coin;
};

function formatArr(columns) {
  columns.forEach((t) => formatOne(t));
}
function formatOne(column) {
  const t = column;
  if (!t) {
    return;
  }
  if (t.dataIndex && !t.key) {
    t.key = t.dataIndex;
  }
  if (!t.showType) {
    return;
  }
  let tmp = "";
  switch (t.showType) {
    case "tpl":
      t.render = (text, record, index) => {
        return tpl(t, text, record);
      };
      break;
    case "btn":
      t.render = (text, record, index) => {
        return (
          <span className="mini-btn" onClick={() => t.fun(text, record, index)}>
            {t.btnLabel || text}
          </span>
        );
      };
      break;
    case "btn-link":
      t.render = (text, record, index) => {
        return (
          <span className="btn-link" onClick={() => t.fun(text, record, index)}>
            {t.btnLabel || text}
          </span>
        );
      };
      break;
    case "date":
      t.render = (text, record, index) => moment(text).format("YYYY-MM-DD");
      break;
    case "date2":
      t.render = (text, record, index) => moment(text).format("MM-DD");
      break;
    case "time":
      t.render = (text, record, index) => moment(text).format("HH:mm:ss");
      break;
    case "time2":
      t.render = (text, record, index) => moment(text).format("HH:mm");
      break;
    case "datetime":
      if (!t.tpl) {
        t.tpl = "YYYY-MM-DD HH:mm:ss";
      }
      t.render = (text, record, index) => {
        if (t.tpl === "fromNow") {
          tmp = moment(text).fromNow();
          if (tmp === "a few seconds ago") {
            tmp = moment().second() - moment(text).second();
            if (tmp < 0) {
              tmp = tmp + 60;
            }
            tmp = tmp + " seconds ago";
          }
          return tmp;
        }
        return moment(text).format(t.tpl);
      };
      break;
    case "datetime2":
      t.render = (text, record, index) => moment(text).format("MM-DD HH:mm");
      break;
    case "copy":
      t.render = (text, record, index) => {
        if (!text) {
          return "";
        }
        text = tpl(t, text, record);
        let showText = text;
        if (text.length > 20) {
          showText =
            text.substring(0, 5) + "****" + text.substring(text.length - 5);
        }
        return (
          <Tooltip placement="topLeft" title="click copy">
            <span
              onClick={() => {
                copy(text);
                message.success("Copy successful !");
              }}
              className="enable-copy-txt-box">
              {showText}
              &nbsp;
              <CopyOutlined />
            </span>
          </Tooltip>
        );
      };
      break;
    case "accountIcon":
      t.render = (text, record, index) => {
        if (!text) {
          return text;
        }
        let showText = text;
        if (text.length > 20) {
          showText =
            text.substring(0, 5) + "****" + text.substring(text.length - 5);
        }
        return (
          <Tooltip placement="topLeft">
            <span className="enable-copy-icon-box">
              <AccountIcon
                hash={text}
                onClick={() => {
                  copy(text);
                  message.success("Copy successful !");
                }}
                title="click copy"
              />
              <NavLink to={"/account/" + text} title="link">
                &nbsp;
                {showText}
                &nbsp;
              </NavLink>
              <CopyOutlined
                onClick={() => {
                  copy(text);
                  message.success("Copy successful !");
                }}
                title="click copy"
              />
            </span>
          </Tooltip>
        );
      };
      break;
    case "link":
      if (!t.tpl) {
        t.tpl = "./";
      }
      t.render = (text, record, index) => {
        let tpl = t.tpl;
        Object.keys(record).forEach((k) => {
          tpl = tpl.replace("{" + k + "}", record[k]);
        });
        return (
          <NavLink className="link" to={tpl}>
            {text}
          </NavLink>
        );
      };
      break;
    case "currency":
      t.render = (text, record, index) => {
        if (!text) {
          return "";
        }
        if (!text.money) {
          console.log(text);
          text = formatterCurrency(text);
        }
        return (
          <>
            <span className="money">{text && text.money}</span>
            <span className="suffix">{text && text.suffix} TCESS</span>
          </>
        );
      };
      break;
    case "currency-m":
      t.render = (text, record, index) => {
        if (!text) {
          return "";
        }
        return (
          <>
            <span className="money">{formatterCurrencyMill(text)}M</span>
          </>
        );
      };
      break;
    case "currency-qianfen":
      t.render = (text, record, index) => {
        if (!text) {
          return "";
        }
        return (
          <>
            <span className="money">
              {tpl(t, formatterCurrencyStr(text), record)}
            </span>
          </>
        );
      };
      break;
    case "store-size-g":
      t.render = (text, record, index) => {
        if (!text) {
          return "";
        }
        return tpl(t, formatterSizeFromMBToGB(text), record);
      };
      break;
    case "progress":
      t.render = (text, record, index) => {
        return (
          <Progress
            style={{ width: 200 }}
            strokeColor="blue"
            percent={text}
            size="small"
          />
        );
      };
      break;
    case "addr":
      t.render = (text, record, index) => {
        if (!text) return text;
        return text.slice(0, 8) + "..." + text.slice(-8);
      };
      break;
    default:
      return;
  }
}
function tpl(column, text, record) {
  if (!column.tpl) return text;
  let tpl = column.tpl;
  Object.keys(record).forEach((k) => {
    let v = record[k];
    if (k == column.dataIndex || k == column.key) {
      v = text;
    }
    tpl = tpl.replace("{" + k + "}", v);
  });
  return tpl;
}
function formatDataSource(columns, dataSource) {
  formatArr(columns);
  dataSource.forEach((t, index) => {
    columns.forEach((column) => {
      t[column.dataIndex + "_s"] = t[column.dataIndex];
      if (column.render) {
        t[column.dataIndex] = column.render(t[column.dataIndex], t, index);
      }
    });
  });
}

function formatBalance(balance) {
  if (!balance) {
    return "";
  }
  if (typeof balance == "string") {
    balance = parseInt(balance.split(",").join(""));
  }
  if (typeof balance == "object" && balance.free) {
    balance = parseInt(balance.free.toString());
  }
  if (isNaN(balance)) {
    return balance;
  }
  return Math.floor((balance / LAMPORTS_PER_SOL) * 100) / 100;
}
function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}

export { formatDataSource, formatBalance, formatAddress };
