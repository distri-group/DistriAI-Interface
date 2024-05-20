import { formatBalance } from "@/utils/index.js";
import axios from "@/utils/axios.js";

const baseUrl = "/machine";

// Get market listed machines or user's owned machines.
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
  const res = await axios.post(apiUrl, body, {
    headers,
  });
  for (let machine of res.List) {
    machine = formatMachine(machine);
  }
  return res;
}

// Retrieve the detailed information of the machine from the storage based on the provided id.
export async function getMachineDetail(Owner, Uuid) {
  const apiUrl = baseUrl + `/${Owner}/${Uuid}`;
  const res = await axios.get(apiUrl);
  return formatMachine(res);
}

export async function getFilterData() {
  const apiUrl = baseUrl + "/filter";
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
}

// Format Machine Info
export function formatMachine(item) {
  const statusName = ["Not-Listed", "Listed", "Rented"];
  item.StatusName = statusName[item.Status];
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
    item.CPS = item.Metadata.Score?.toFixed(2) || 0;
    item.CPU = item.Metadata.CPUInfo?.ModelName || "";
    item.GPU = item.GpuCount + "x" + item.Gpu;
    item.RAM = item.Metadata.InfoMemory?.RAM?.toFixed(0);
    item.IP = item.Metadata.Ip?.ip;
    item.Port = item.Metadata.Ip?.port;
    item.AvailPorts = item.Metadata.Ip?.expandPort || [];
    item.SecurityLevel = parseInt(item.Metadata.SecurityLevel);
    item.Tflops = item.Metadata.InfoTFLOPS?.TFLOPS;
    item.Speed = item.Metadata.SpeedInfo;
    item.AvailDiskStorage = item.Disk;
    item.Speed = {
      Upload: item.Metadata.SpeedInfo.Upload,
      Download: item.Metadata.SpeedInfo.Download,
    };
    item.GPUMemory = item.Metadata.GPUInfo.Memory;
    if (item.Metadata.GPUInfo?.Memory) {
      const memory = parseInt(item.Metadata.GPUInfo.Memory.match(/\d+/)[0]);
      item.GPUMemory = `${
        memory > 1024
          ? Math.floor((memory / 1024) * 100) / 100 + "GiB"
          : memory + " MiB"
      }`;
    }
    item.From = "Distri.AI";
  }
  return item;
}
