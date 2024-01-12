import * as store from "../utils/store";
import * as utils from "../utils";
import request from "../utils/request";
import { formatAddress, formatBalance } from "../utils/format";
// Retrieve the detailed information of the machine from the storage based on the provided id.
export async function getMachineDetailById(id) {
  let obj = store.get("all-machine-list");
  if (!obj) {
    return null;
  }
  return obj.find((t) => t.id === id);
}

export async function getMachineDetailByUuid(uuid) {
  let obj = store.get("all-machine-list");
  if (!obj) {
    return null;
  }
  return obj.find((t) => t.Uuid === uuid);
}

export async function getFilterData() {
  let apiUrl = "/index-api/machine/filter";
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
    name: "SecurityLevel",
    arr: [
      { label: "ANY Level", value: "all" },
      { label: "Level 0", value: 0 },
      { label: "Level 1", value: 1 },
      { label: "Level 2", value: 2 },
      { label: "Level 3", value: 3 },
    ],
  });
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
  store.set("filter-list", list);
  return list;
}

export async function getMachineList(isMine, pageIndex, filter, publicKey) {
  try {
    let apiUrl = isMine
      ? "/index-api/machine/mine"
      : "/index-api/machine/market";
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
    let obj;
    if (Number.isInteger(filter?.SecurityLevel)) {
      let level = filter.SecurityLevel;
      list = list.filter((item) => item.SecurityLevel === level);
    }
    obj = { list, total };
    console.log("Machine List", list);
    store.set("curr-machine-list", obj);
    let allList = store.get("all-machine-list") || [];
    list.forEach((t) => {
      let index = allList.findIndex((a) => a.Uuid === t.Uuid);
      if (index === -1) {
        allList.push(t);
      } else {
        allList[index] = t;
      }
    });
    store.set("all-machine-list", allList);
    return obj;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function formatMachine(item) {
  try {
    item.Addr = formatAddress(item.Owner);
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
    if (item.Metadata && typeof item.Metadata == "string") {
      item.Metadata = JSON.parse(item.Metadata);
      item.Uuid = item.Metadata.MachineAccounts || "";
      item.UuidShort = item.Metadata.MachineUUID?.slice(-10);
      item.Score = item.Metadata.Score?.toFixed(2) || 0;
      item.Cpu = item.Metadata.CPUInfo?.ModelName || "";
      item.RAM = item.Metadata.InfoMemory?.RAM?.toFixed(0) + "GB";
      item.UploadSpeed = item.Metadata.SpeedInfo?.Upload;
      item.DownloadSpeed = item.Metadata.SpeedInfo?.Download;
      item.IP = item.Metadata.Ip?.ip || "127.0.0.1";
      item.Port = item.Metadata.Ip?.port || "8080";
      item.SecurityLevel = parseInt(item.Metadata.SecurityLevel);
    }
  } catch (e) {
    console.log(e);
  }
}
