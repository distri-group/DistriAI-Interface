import axios from "@/utils/axios.js";
import { formatMachine } from "./machine.js";
import { formatBalance } from "@/utils";

const baseUrl = "/reward";

export async function getRewardList(pageIndex, pageSize, publicKey) {
  const apiUrl = baseUrl + "/period/list";
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
  };
  const headers = {
    Account: publicKey,
  };
  const res = await axios.post(apiUrl, body, { headers });
  return res;
}

export async function getRewardDetail(Period) {
  const apiUrl = `${baseUrl}/period/detail`;
  const res = await axios.post(apiUrl, { Period });
  return res;
}

export async function getRewardTotal(period, publicKey) {
  const apiUrl = baseUrl + "/total";
  const body = !isNaN(period)
    ? {
        Period: period,
      }
    : {};
  const headers = {
    Account: publicKey,
  };
  const res = await axios.post(apiUrl, body, { headers });
  let formattedRes = Object.fromEntries(
    Object.entries(res).map(([key, value]) => [key, formatBalance(value)])
  );
  formattedRes.totalClaimable =
    formattedRes.ClaimablePeriodicRewards + formattedRes.ClaimableTaskRewards;
  formattedRes.totalClaimed =
    formattedRes.ClaimedPeriodicRewards + formattedRes.ClaimedTaskRewards;
  return formattedRes;
}

export async function getClaimableReward(
  period,
  pageIndex,
  pageSize,
  publicKey
) {
  const apiUrl = baseUrl + "/claimable/list";
  const body = !isNaN(period)
    ? {
        Period: period,
        PageIndex: pageIndex,
        PageSize: pageSize,
      }
    : {
        PageIndex: pageIndex,
        PageSize: pageSize,
      };
  const headers = {
    Account: publicKey,
  };
  const res = await axios.post(apiUrl, body, { headers });
  return res;
}

export async function getPeriodMachine(Period, PageIndex, PageSize, Account) {
  const apiUrl = baseUrl + "/machine/list";
  const body = {
    Page: PageIndex,
    PageSize,
    Period,
  };
  const headers = {
    Account,
  };
  const res = await axios.post(apiUrl, body, { headers });
  for (let machine of res.List) {
    machine = formatMachine(machine);
  }
  return res;
}
