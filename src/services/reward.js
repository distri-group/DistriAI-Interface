import axios from "../utils/axios";
import { formatMachine } from "./machine";

const baseUrl = "/reward";

export const getRewardList = async (pageIndex, pageSize, publicKey) => {
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
};

export const getRewardTotal = async (period, publicKey) => {
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
    return res;
  } catch (error) {
    throw error;
  }
};

export const getClaimableReward = async (
  period,
  pageIndex,
  pageSize,
  publicKey
) => {
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
};

export const getPeriodMachine = async (
  period,
  pageIndex,
  pageSize,
  publicKey
) => {
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
};
