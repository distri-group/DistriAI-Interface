import moment from "moment";
import { getTimeDiff } from "time-difference-js";
import { utils } from "@project-serum/anchor";
import { formatBalance, getProvider } from "@/utils/index.js";
import axios from "@/utils/axios.js";

const baseUrl = "/order";

export async function getOrderList(pageIndex, pageSize, filter, publicKey) {
  const apiUrl = baseUrl + "/mine";
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
  };
  const headers = {
    Account: publicKey,
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
  for (let order of res.List) {
    order = formatOrder(order);
  }
  return res;
}

export async function getTotalEarnings(total, publicKey) {
  const res = await getOrderDetail(1, total, {
    Direction: "sell",
    publicKey,
  });
  let pending = 0;
  let received = 0;
  res.List.forEach((currentValue) => {
    if (
      currentValue.StatusName === "Preparing" ||
      currentValue.StatusName === "Available"
    ) {
      pending += currentValue.Total;
    } else if (currentValue.StatusName === "Completed") {
      received += currentValue.Total;
    } else if (currentValue.StatusName === "Refunded") {
      const refundDuration = Math.ceil(
        (new Date(currentValue.RefundTime) - new Date(currentValue.StartTime)) /
          3600000
      );
      received += refundDuration * currentValue.Price;
    }
  });
  return { pending, received };
}

export async function getOrderDetail(Id) {
  const apiUrl = baseUrl + `/${Id}`;
  const res = await axios.get(apiUrl);
  return formatOrder(res);
}

export async function checkIfPrepared(order, done) {
  const res = await getOrderDetail(order.Uuid);
  if (done) {
    return res.StatusName !== "Available";
  } else {
    return res.StatusName === "Available" || res.StatusName === "Failed";
  }
}

export const filterData = {
  Status: [
    { label: "All Status", value: "all" },
    { label: "Preparing", value: 0 },
    { label: "Available", value: 1 },
    { label: "Completed", value: 2 },
    { label: "Failed", value: 3 },
    { label: "Refunded", value: 4 },
  ],
};

// Format Order Info
function formatOrder(item) {
  if (item.Metadata) {
    item.Metadata = JSON.parse(item.Metadata);
  }
  item.Price = formatBalance(item.Price);
  item.Total = formatBalance(item.Total);
  let endTime = moment(item.StartTime).add(item.Duration, "hours").toDate();
  const statusName = [
    "Preparing",
    "Available",
    "Completed",
    "Failed",
    "Refunded",
  ];
  item.StatusName = statusName[item.Status];
  item.EndTime = endTime.toISOString();
  if (item.StatusName === "Available") {
    if (new Date() < endTime) {
      const result = getTimeDiff(new Date(), endTime);
      item.RemainingDuration = result.suffix.includes("hour")
        ? result.value
        : 0;
    }
  } else if (item.StatusName === "Failed") {
    item.Duration = 0;
    item.EndTime = null;
  }
  if (item.RefundTime && new Date(item.RefundTime).getTime() !== 0) {
    item.RefundDuration =
      item.Duration -
      Math.ceil(
        (new Date(item.RefundTime) - new Date(item.OrderTime)) / 3600000
      );
  }
  return item;
}

export async function signToken(ip, port, publicKey, deploy) {
  const provider = getProvider();
  const msg = `${deploy ? "deploy" : "workspace"}/token${
    !deploy ? "/" + parseInt(Date.now() / 100000) : ""
  }/${publicKey}`;
  const encodeMsg = new TextEncoder().encode(msg);
  const sign = await provider.signMessage(encodeMsg, "utf8");
  const signature = utils.bytes.bs58.encode(sign.signature);
  return `http://${ip}:${port}/distri/workspace/debugToken/${signature}`;
}
