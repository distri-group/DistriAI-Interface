import cache from "../utils/store";
import * as utils from "../utils";
import request from "../utils/request";
import webconfig from "../webconfig";
import { formatAddress, formatBalance } from "../utils/format";

export async function getMachineDetailById(id) {
  let obj = cache.get("all-machine-list");
  if (!obj) {
    return null;
  }
  return obj.find((t) => t.id === id);
}

export async function getMachineDetailByUuid(uuid) {
  let obj = cache.get("all-machine-list");
  if (!obj) {
    return null;
  }
  return obj.find((t) => t.Uuid === uuid);
}

export async function getFilterData() {
  let apiUrl = "/api/machine/filter";
  let ret = await request.post(apiUrl);
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

export async function getMachineList(isMine, pageIndex, filter, publicKey) {
  try {
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
      let Account = publicKey;
      if (Account) {
        options.headers = {
          Account,
        };
      }
    }
    let ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      utils.alert(ret.msg);
      return null;
    }
    let total = ret.Data.Total;
    let list = ret.Data.List;

    for (let item of list) {
      formatMachine(item);
    }
    let obj = { list, total };
    console.log("Machine List", list);
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

function formatMachine(item) {
  try {
    if (item.Metadata && typeof item.Metadata == "string") {
      item.Metadata = JSON.parse(item.Metadata);
    }
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
    item.SecurityLevel = parseInt(item.Metadata?.SecurityLevel);
  } catch (e) {
    console.log(e);
  }
}
