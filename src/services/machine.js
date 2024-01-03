// 机器相关接口
import cache from "../utils/store";
import * as utils from "../utils";
import webconfig from "../webconfig";
import { formatAddress, formatBalance } from "../utils/formatter";

/**
 * 根据 id 获取机器详情
 * @param {string} id
 * @returns
 */
export async function getMachineDetailById(id) {
  let obj = cache.get("all-machine-list");
  if (!obj) {
    return null;
  }
  return obj.find((t) => t.id === id);
}
/**
 * 根据 uuid 获取机器详情
 * @param {*} uuid
 * @returns
 */
export async function getMachineDetailByUuid(uuid) {
  let obj = cache.get("all-machine-list");
  if (!obj) {
    return null;
  }
  return obj.find((t) => t.Uuid === uuid);
}
/**
 * 获取过滤信息
 * @returns
 */
export async function getFilterData() {
  let obj = cache.get("filter-list");
  if (webconfig.isDebug && obj) {
    return obj;
  }
  let apiUrl = "/api/machine/filter";
  // let apiUrl = "/machine/filter";
  let ret = await utils.request.post(apiUrl);
  if (ret.Msg !== "success") {
    utils.alert(ret.msg);
    return null;
  }
  let list = [];
  for (let k in ret.Data) {
    let arr = ret.Data[k].map((t) => {
      return {
        label: t,
        value: t,
      };
    });
    arr.unshift({
      label: "ANY " + k,
      value: "all",
    });
    list.push({
      name: k,
      arr,
    });
  }
  list.push({
    name: "OrderBy",
    arr: [
      { label: "Auto Sort", value: "all" },
      { label: "Price(Inc.)", value: "price" },
      { label: "Price(Dec.)", value: "price DESC" },
      { label: "TFLOPS", value: "tflops DESC" },
      { label: "Score", value: "score DESC" },
      { label: "Reliability", value: "reliability" },
    ],
  });
  cache.set("filter-list", list);
  return list;
}
/**
 * 获取机器列表:分为我的机器和所有机器
 * @param {boolean} isMine
 * @param {number} pageIndex
 * @param {*} filter
 * @returns
 */
export async function getMachineList(isMine, pageIndex, filter) {
  try {
    let obj = cache.get("curr-machine-list");
    if (webconfig.isDebug && obj) {
      return obj;
    }
    let apiUrl = isMine ? "/api/machine/mine" : "/api/machine/market";
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
          options.data[k] = v;
        }
      }
    }
    if (isMine) {
      let Account = localStorage.getItem("addr");
      if (Account) {
        options.headers = {
          Account,
        };
      }
    }
    let ret = await utils.request.post(apiUrl, options);
    console.log({ ret });
    if (ret.Msg !== "success") {
      utils.alert(ret.msg);
      return null;
    }
    let total = ret.Data.Total;
    let list = ret.Data.List;

    for (let item of list) {
      formatMachine(item);
    }
    console.log(list);
    obj = { list, total };
    cache.set("curr-machine-list", obj);
    let allList = cache.get("all-machine-list") || [];
    list.forEach((t) => {
      let index = allList.findIndex((a) => a.Uuid === t.Uuid);
      if (index === -1) {
        allList.push(t);
      } else {
        allList[index] = t;
      }
    });
    cache.set("all-machine-list", allList);
    return obj;
  } catch (e) {
    console.log(e);
    return null;
  }
}
/**
 * 处理数据
 * @param {Object} item
 */
function formatMachine(item) {
  try {
    if (item.Metadata && typeof item.Metadata == "string") {
      item.Metadata = JSON.parse(item.Metadata);
    }
    // let tmp= getPublicKeyFromStr("machine", item.Owner, item.Metadata.MachineUUID);
    // console.log(tmp);
    // item.Uuid = "DrZDdZQV19r6Evpn2UHFkvRD73UnwpshPhC2KNVUFPQF";
    item.Uuid = item.Metadata.MachineAccounts;

    item.Addr = formatAddress(item.Owner);
    if (item.Metadata?.MachineUUID) {
      item.UuidShort = item.Metadata.MachineUUID.slice(-10);
    }
    item.Cpu = item.Metadata?.CPUInfo?.ModelName;
    item.RAM = item.Metadata?.InfoMemory?.RAM.toFixed(0) + "GB";
    item.AvailHardDrive = item.Metadata?.DiskInfo?.TotalSpace.toFixed(0) + "GB";
    item.UploadSpeed = item.Metadata?.SpeedInfo?.Upload;
    item.DownloadSpeed = item.Metadata?.SpeedInfo?.Download;
    item.Price = formatBalance(item.Price);
    if (item.CompletedCount + item.FailedCount <= 0) {
      item.Reliability = "--";
    } else {
      item.Reliability =
        parseInt(
          (item.CompletedCount * 100) / (item.CompletedCount + item.FailedCount)
        ) + "%";
    }
    item.TFLOPS = item.Tflops;
  } catch (e) {
    console.log(e);
  }
}
