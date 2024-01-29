import * as store from "../utils/store";
import moment from "moment";
import { formatAddress, formatBalance } from "../utils";
import { getTimeDiff } from "time-difference-js";
import { getMachineList } from "./machine";
import request from "../utils/request";

export async function getOrderList(pageIndex, filter, publicKey) {
  try {
    let apiUrl = "/index-api/order/mine";
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
    let Account = publicKey;
    if (Account) {
      options.headers = {
        Account,
      };
    }
    let ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      return null;
    }
    let total = ret.Data.Total;
    let list = ret.Data.List;
    for (let item of list) {
      formatOrder(item, publicKey);
    }
    let machinList = await getMachineList(true, 1);
    machinList = machinList.list;
    for (let item of list) {
      if (!item.MachineUuid) continue;
      let tmp = machinList.find(
        (t) => t.Metadata?.MachineUUID === item.MachineUuid.replace("0x", "")
      );
      if (tmp && item.Metadata && typeof item.Metadata == "object") {
        item.Metadata.machineInfo = tmp;
      }
    }
    let obj = { list, total };
    store.set("order-list", obj);
    return obj;
  } catch (e) {
    console.log(e);
    return null;
  }
}
function formatOrder(item, publicKey) {
  try {
    if (item.Metadata) {
      item.Metadata = JSON.parse(item.Metadata);
    }
    item.Buyer = formatAddress(item.Buyer);
    item.Seller = formatAddress(item.Seller);
    item.Price = formatBalance(item.Price);
    item.Total = formatBalance(item.Total);
    if (item.Status === 0) {
      let endTime = moment(item.OrderTime).add(item.Duration, "hours").toDate();
      let result = getTimeDiff(new Date(), endTime);
      item.RemainingTime = result.value + " " + result.suffix;
    } else {
      item.RemainingTime = "--";
    }
    item.StatusName =
      item.Status === 0
        ? item.Seller === formatAddress(publicKey)
          ? "Training"
          : item.Buyer === formatAddress(publicKey) && "Available"
        : item.Status === 1
        ? "Completed"
        : "Failed";
  } catch (e) {}
}
export async function getFilterData() {
  let list = [];
  list.push({
    name: "Direction",
    arr: [
      { label: "All Orders", value: "all" },
      { label: "Buy", value: "buy" },
      { label: "Sell", value: "sell" },
    ],
  });
  list.push({
    name: "Status",
    arr: [
      { label: "All Status", value: "all" },
      { label: "Available", value: "0" },
      { label: "Completed", value: "1" },
      { label: "Failed", value: "2" },
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
  console.log("Order Found", orderDetail);
  return { Status: 1, Detail: orderDetail };
}
