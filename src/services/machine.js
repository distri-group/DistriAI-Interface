import { formatBalance } from "../utils";
import axios from "../utils/axios";

const baseUrl = "/machine";

export async function getMachineList(pageIndex, pageSize, filter, publicKey) {
  const apiUrl = baseUrl + (publicKey ? "/mine" : "/market");
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
  };
  const headers = {
    Account: publicKey ?? "",
  };
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== "all") {
        body[key] = value;
      }
    });
  }
  try {
    const res = await axios.post(apiUrl, body, {
      headers,
    });
    for (let machine of res.List) {
      machine = formatMachine(machine);
    }
    return res;
  } catch (error) {
    throw error;
  }
}

// Retrieve the detailed information of the machine from the storage based on the provided id.
export async function getMachineDetail(Owner, Id) {
  const apiUrl = baseUrl + `/${Owner}/${Id}`;
  try {
    const res = await axios.get(apiUrl);
    return formatMachine(res);
  } catch (error) {
    throw error;
  }
}

export async function getFilterData() {
  const apiUrl = baseUrl + "/filter";
  try {
    let res = await axios.post(apiUrl);
    Object.entries(res).forEach(([key, value]) => {
      value.forEach((item, index) => {
        value[index] = {
          label: item,
          value: item,
        };
      });
      value.unshift({
        label:
          "ANY " +
          (key === "Gpu" ? "GPU" : key === "GpuCount" ? "GPU Count" : key),
        value: "all",
      });
    });
    res.OrderBy = [
      { label: "Auto Sort", value: "all" },
      { label: "TFLOPS", value: "tflops DESC" },
      { label: "Score", value: "score DESC" },
      { label: "Reliability", value: "reliability" },
      { label: "Max Duration", value: "max_duration DESC" },
      { label: "Disk", value: "disk DESC" },
      { label: "RAM", value: "ram DESC" },
    ];
    return res;
  } catch (error) {
    throw error;
  }
}

// Format Machine Info
export function formatMachine(item) {
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
    item.Provider = item.Metadata.Addr;
    item.UUID = item.Metadata.MachineUUID || "";
    item.CPS = item.Metadata.Score?.toFixed(2) || 0;
    item.CPU = item.Metadata.CPUInfo?.ModelName || "";
    item.GPU = item.GpuCount + "x" + item.Gpu;
    item.RAM = item.Metadata.InfoMemory?.RAM?.toFixed(0) + "GB";
    item.IP = item.Metadata.Ip?.ip;
    item.Port = item.Metadata.Ip?.port;
    item.SecurityLevel = parseInt(item.Metadata.SecurityLevel);
    item.Tflops = item.Metadata.InfoTFLOPS?.TFLOPS;
    item.Speed = item.Metadata.SpeedInfo;
    item.AvailDiskStorage = item.Disk;
    item.Speed = {
      Upload: item.Metadata.SpeedInfo.Upload,
      Download: item.Metadata.SpeedInfo.Download,
    };
    item.GPUMemory = item.Metadata.GPUInfo.Memory;
    item.From =
      item.CPS > 75 ? "Distri.AI" : item.CPS > 70 ? "Render" : "io.net";
  }
  return item;
}
