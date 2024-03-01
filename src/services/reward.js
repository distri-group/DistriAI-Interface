import request from "../utils/request";
import { formatMachine } from "./machine";

export const getRewardList = async (pageIndex, publicKey) => {
  const apiUrl = "/index-api/reward/period/list";
  const options = {
    data: {
      Page: pageIndex,
      PageSize: 10,
    },
    headers: {
      Account: publicKey,
    },
  };
  const res = await request.post(apiUrl, options);
  if (res.Code !== 1) {
    return null;
  }
  return res.Data;
};

export const getRewardTotal = async (period, publicKey) => {
  const apiUrl = "/index-api/reward/total";
  let options = {
    headers: {
      Account: publicKey,
    },
    data: {},
  };
  if (period) {
    options.data.Period = period;
  }
  const res = await request.post(apiUrl, options);
  if (res.Code !== 1) {
    return null;
  }
  return res.Data;
};

export const getClaimableReward = async (period, pageIndex, publicKey) => {
  const apiUrl = "/index-api/reward/claimable/list";
  let options = {
    headers: {
      Account: publicKey,
    },
    data: {
      Page: pageIndex,
      PageSize: 10,
    },
  };
  if (period) {
    options.data.Period = period;
  }
  const res = await request.post(apiUrl, options);
  if (res.Code !== 1) {
    return null;
  }
  return res.Data;
};

export const getPeriodMachine = async (period, pageIndex, publicKey) => {
  const apiUrl = "/index-api/reward/machine/list";
  const options = {
    headers: {
      Account: publicKey,
    },
    data: {
      Page: pageIndex,
      PageSize: 10,
      Period: period,
    },
  };
  const res = await request.post(apiUrl, options);
  if (res.Code !== 1) {
    return null;
  }
  if (res.Data.List) {
    for (let machine of res.Data.List) {
      formatMachine(machine);
    }
  }
  return res.Data;
};
