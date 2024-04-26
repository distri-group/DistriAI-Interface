import axios from "@/utils/axios.js";
import { formatMachine } from "./machine.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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
  try {
    const res = await axios.post(apiUrl, body, { headers });
    return res;
  } catch (error) {
    throw error;
  }
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
  try {
    const res = await axios.post(apiUrl, body, { headers });
    let formattedRes = Object.fromEntries(
      Object.entries(res).map(([key, value]) => [
        key,
        Number((value / LAMPORTS_PER_SOL).toFixed(2)),
      ])
    );
    formattedRes.totalClaimable =
      formattedRes.ClaimablePeriodicRewards + formattedRes.ClaimableTaskRewards;
    formattedRes.totalClaimed =
      formattedRes.ClaimedPeriodicRewards + formattedRes.ClaimedTaskRewards;
    return formattedRes;
  } catch (error) {
    throw error;
  }
}

export async function getClaimableReward(
  period,
  pageIndex,
  pageSize,
  publicKey
) {
  const apiUrl = baseUrl + "/claimable/list";
  const body = {
    Period: period ?? "",
    Page: pageIndex,
    PageSize: pageSize,
  };
  const headers = {
    Account: publicKey,
  };
  try {
    const res = await axios.post(apiUrl, body, { headers });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getPeriodMachine(period, pageIndex, pageSize, publicKey) {
  const apiUrl = baseUrl + "/machine/list";
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
    Period: period,
  };
  const headers = {
    Account: publicKey,
  };
  try {
    const res = await axios.post(apiUrl, body, { headers });
    for (let machine of res.List) {
      machine = formatMachine(machine);
    }
    return res;
  } catch (error) {
    throw error;
  }
}
