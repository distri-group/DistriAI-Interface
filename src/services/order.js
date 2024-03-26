import moment from "moment";
import { formatBalance } from "../utils";
import { getTimeDiff } from "time-difference-js";
import request from "../utils/request";
import * as anchor from "@project-serum/anchor";

export async function getOrderList(pageIndex, filter, publicKey) {
  try {
    const apiUrl = "/index-api/order/mine";
    let options = {
      data: {
        Page: pageIndex,
        PageSize: 10,
      },
    };
    if (filter) {
      for (let k in filter) {
        let v = filter[k];
        if (v && v !== "all") {
          if (k === "Status") v = parseInt(v);
          options.data[k] = v;
        }
      }
    }
    if (publicKey) {
      options.headers = {
        Account: publicKey,
      };
    }
    const ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      return null;
    }
    const total = ret.Data.Total;
    let list = ret.Data.List;
    for (let item of list) {
      formatOrder(item, publicKey);
    }
    console.log(list);
    return { list, total };
  } catch (e) {
    throw e;
  }
}
function formatOrder(item) {
  if (item.Metadata) {
    item.Metadata = JSON.parse(item.Metadata);
  }
  item.Price = formatBalance(item.Price);
  item.Total = formatBalance(item.Total);
  let endTime = moment(item.StartTime).add(item.Duration, "hours").toDate();
  const statusName = [
    "Preparing",
    "Available",
    "Completed",
    "Failed",
    "Refunded",
  ];
  item.StatusName = statusName[item.Status];
  if (item.StatusName === "Available") {
    if (new Date() < endTime) {
      const result = getTimeDiff(new Date(), endTime);
      item.RemainingTime = result.value + " " + result.suffix;
      item.RemainingDuration = result.suffix.includes("hour")
        ? result.value
        : 1;
    }
  } else if (item.StatusName === "Failed") {
    item.Duration = 0;
  }
  item.EndTime = endTime.toISOString();
  if (item.RefundTime && new Date(item.RefundTime).getTime() !== 0) {
    item.RefundDuration =
      item.Duration -
      Math.ceil(
        (new Date(item.RefundTime) - new Date(item.OrderTime)) / 3600000
      );
  }
}
export function getFilterData() {
  let list = [];
  list.push({
    name: "Status",
    arr: [
      { label: "All Status", value: "all" },
      { label: "Preparing", value: "0" },
      { label: "Available", value: "1" },
      { label: "Completed", value: "2" },
      { label: "Failed", value: "3" },
      { label: "Refunded", value: "4" },
    ],
  });
  return list;
}

export const signToken = async (ip, port, publicKey) => {
  const provider = window.phantom.solana;
  const msg = "workspace/token/" + publicKey;
  const encodeMsg = new TextEncoder().encode(msg);
  try {
    const sign = await provider.signMessage(encodeMsg, "utf8");
    const signature = anchor.utils.bytes.bs58.encode(sign.signature);
    window.open(
      `http://${ip}:${port}/distri/workspace/debugToken/${signature}`
    );
  } catch (e) {
    throw e;
  }
};

export async function getDetailByUuid(uuid, publicKey) {
  const obj = await getOrderList(1, [], publicKey);
  if (!obj) {
    return { Status: 0, Msg: "Order list not found" };
  }
  const orderDetail = obj.list.find((t) => t.Uuid === uuid);
  if (!orderDetail) {
    return { Status: 0, Msg: "Order detail of " + uuid + " not found." };
  }
  return { Status: 1, Detail: orderDetail };
}
