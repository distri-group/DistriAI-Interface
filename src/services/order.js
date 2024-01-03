import cache from "../utils/store";
import * as util from "../utils";
import moment from "moment";
import webconfig from "../webconfig";
import { formatAddress, formatBalance } from "../utils/formatter";
import { getTimeDiff } from "time-difference-js";
import { getMachineList } from "./machine";

/**
 * 获取订单列表
 * @param {number} pageIndex
 * @param {Array} filter
 * @returns
 */
export async function getOrderList(pageIndex, filter) {
  try {
    let obj = cache.get("order-list");
    if (webconfig.isDebug && obj) {
      return obj;
    }
    let apiUrl = "/api/order/mine";
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
    let Account = localStorage.getItem("addr");
    if (Account) {
      options.headers = {
        Account,
      };
    }
    let ret = await util.request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      util.alert(ret.msg);
      return null;
    }
    let total = ret.Data.Total;
    let list = ret.Data.List;
    for (let item of list) {
      formatOrder(item);
    }
    let machinList = await getMachineList(true, 1);
    console.log({ machinList });
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
    console.log("*******************************");
    console.log(list);
    obj = { list, total };
    cache.set("order-list", obj);
    return obj;
  } catch (e) {
    console.log(e);
    return null;
  }
}
function formatOrder(item) {
  try {
    if (item.Metadata) {
      item.Metadata = JSON.parse(item.Metadata);
      if (item.Metadata?.machinePublicKey) {
        item.Uuid = item.Metadata?.machinePublicKey;
      }
    }
    item.Buyer = formatAddress(item.Buyer);
    item.Seller = formatAddress(item.Seller);
    item.Price = formatBalance(item.Price);
    item.Total = formatBalance(item.Total);

    if (item.Status === 0) {
      // console.log('orderTime',item.Metadata.formData.orderTime);
      // console.log('duration',item.Metadata.formData.duration);
      let endTime = moment(item.Metadata.formData.orderTime)
        .add(item.Metadata.formData.duration, "hours")
        .toDate();
      let result = getTimeDiff(new Date(), endTime);
      item.RemainingTime = result.value + " " + result.suffix;
    } else {
      item.RemainingTime = "--";
    }
    item.StatusName =
      item.Status === 0
        ? "Training"
        : item.Status == 1
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
      { label: "Training", value: "0" },
      { label: "Completed", value: "1" },
      { label: "Failed", value: "2" },
    ],
  });
  return list;
}
export async function getDetailByUuid(uuid) {
  let obj = await getOrderList(1);
  // let obj = cache.get("order-list");
  if (!obj) {
    util.showError("Order list not found.");
    return null;
  }
  console.log("obj.list-----------------", obj.list);
  let orderDetail = obj.list.find((t) => t.Uuid === uuid);
  if (!orderDetail) {
    util.showError("Order detail of " + uuid + " not found.");
    console.log(obj.list);
    return null;
  }
  return orderDetail;
}
export async function getLiberyList() {
  return [{ label: "pytorch", value: "pytorch" }];
}
export async function getModelList() {
  return [
    { label: "mnist_rnn", value: "mnist_rnn" },
    { label: "word_language_model", value: "word_language_model" },
  ];
}
/**
 * 学习log
 * @param {string} orderUuid
 * @param {number} pageIndex
 * @param {number} pageSize
 * @returns
 */
export async function getLogList(orderUuid, pageIndex, pageSize) {
  try {
    // orderUuid='0xb711ebf34e474f4db43198e23a59d433';
    // orderUuid=orderUuid.slice(2);

    let obj = cache.get("log-list");
    if (webconfig.isDebug && obj) {
      return obj;
    }
    let apiUrl = "/api/log/list";
    let options = {
      data: {
        Page: pageIndex || 1,
        OrderUuid: orderUuid,
        PageSize: pageSize || 20,
      },
    };
    let ret = await util.request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      util.alert(ret.msg);
      return null;
    }
    let total = ret.Data.Total;
    let list = ret.Data.List;
    // let arr = [];
    for (let item of list) {
      item.CreatedAtStr = moment(item.CreatedAt).format("MM-DD HH:mm:ss");
      item.ContentArr = item.Content.split("\r").join("\n").split("\n");
    }
    console.log(list);
    obj = { list, total };
    cache.set("log-list", obj);
    return obj;
  } catch (e) {
    console.log(e);
    return null;
  }
}
