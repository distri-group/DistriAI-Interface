import request from "../utils/request";
import { formatBalance } from "../utils";
// Retrieve the detailed information of the machine from the storage based on the provided id.

export async function getMachineDetailByUuid(uuid, publicKey) {
  const res = await getMachineList(1, [], publicKey);
  const list = res.list;
  return list.find((item) => item.Metadata.MachineUUID === uuid);
}

export async function getFilterData() {
  let apiUrl = "/index-api/machine/filter";
  let ret = await request.post(apiUrl);
  if (ret.Msg !== "success") {
    return ret;
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
      label:
        "ANY " + (k === "Gpu" ? "GPU" : k === "GpuCount" ? "GPU Count" : k),
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
  return list;
}

export async function getMachineList(pageIndex, filter, publicKey) {
  try {
    let apiUrl = publicKey
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
    if (publicKey) {
      let Account = publicKey;
      if (Account) {
        options.headers = {
          Account,
        };
      }
    }
    let ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
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
    return obj;
  } catch (e) {
    throw e;
  }
}

// Format Machine's Info
export function formatMachine(item) {
  try {
    item.Price = formatBalance(item.Price);
    if (item.CompletedCount + item.FailedCount <= 0) {
      item.Reliability = "--";
    } else {
      item.Reliability =
        parseInt(
          (item.CompletedCount * 100) / (item.CompletedCount + item.FailedCount)
        ) + "%";
    }
    if (item.Metadata && typeof item.Metadata == "string") {
      item.Metadata = JSON.parse(item.Metadata);
      item.Uuid = item.Metadata.MachineUUID || "";
      item.UuidShort = item.Metadata.MachineUUID?.slice(-10);
      item.Score = item.Metadata.Score?.toFixed(2) || 0;
      item.Cpu = item.Metadata.CPUInfo?.ModelName || "";
      item.RAM = item.Metadata.InfoMemory?.RAM?.toFixed(0) + "GB";
      item.UploadSpeed = item.Metadata.SpeedInfo?.Upload;
      item.DownloadSpeed = item.Metadata.SpeedInfo?.Download;
      item.IP = item.Metadata.Ip?.ip;
      item.Port = item.Metadata.Ip?.port;
      item.SecurityLevel = parseInt(item.Metadata.SecurityLevel);
    }
  } catch (e) {
    throw e;
  }
}
