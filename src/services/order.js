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
    list.map((item, index) => {
      let machine = machineList.find(
        (machine) => machine.Uuid === item.MachineUuid.slice(2)
      );
      if (machine) {
        list[index].Metadata.MachineInfo = machine;
      }
    });
    return { list, total };
  } catch (e) {
    console.log(e);
    return null;
  }
}
function formatOrder(item) {
  if (item.Metadata) {
    item.Metadata = JSON.parse(item.Metadata);
  }
  item.Price = formatBalance(item.Price);
  item.Total = formatBalance(item.Total);
  if (item.Status === 0) {
    const endTime = moment(item.OrderTime).add(item.Duration, "hours").toDate();
    const result = getTimeDiff(new Date(), endTime);
    item.RemainingTime = result.value + " " + result.suffix;
  } else {
    item.RemainingTime = "--";
  }
  item.StatusName =
    item.Status === 0
      ? "Available"
      : item.Status === 1
      ? "Completed"
      : "Refunded";
}
export function getFilterData() {
  let list = [];
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
