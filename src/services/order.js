import moment from "moment";
import { formatBalance } from "../utils";
import { getTimeDiff } from "time-difference-js";
import { getMachineList } from "./machine";
import request from "../utils/request";

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
    let res = await getMachineList(1);
    let machineList = res.list;
    for (let item of list) {
      let machine = machineList.find(
        (machine) => machine.Uuid === item.MachineUuid.slice(2)
      );
      if (machine) {
        item.Metadata.MachineInfo = machine;
      }
    }
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
  const endTime = moment(item.OrderTime).add(item.Duration, "hours").toDate();
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
  switch (item.Status) {
    case 0:
      item.StatusName = "Preparing";
      break;
    case 1:
      item.StatusName = "Available";
      break;
    case 2:
      item.StatusName = "Completed";
      break;
    case 3:
      item.StatusName = "Failed";
      break;
    case 4:
      item.StatusName = "Refunded";
      break;
    default:
      break;
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
export async function getDetailByUuid(uuid, publicKey) {
  let obj = await getOrderList(1, [], publicKey);
  if (!obj) {
    return { Status: 0, Msg: "Order list not found" };
  }
  let orderDetail = obj.list.find((t) => t.Uuid === uuid);
  if (!orderDetail) {
    return { Status: 0, Msg: "Order detail of " + uuid + " not found." };
  }
  return { Status: 1, Detail: orderDetail };
}
