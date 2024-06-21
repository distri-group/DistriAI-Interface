import axios from "@/utils/axios.js";
import { formatBalance } from "@/utils";

const baseUrl = "/model-reward";
export async function getModelRewardPool() {
  const apiUrl = `${baseUrl}/pool/total`;
  const res = await axios.get(apiUrl);
  return formatBalance(res);
}

export async function getModelRewardList(Page, PageSize, Account, Period) {
  const apiUrl = `${baseUrl}/list`;
  let body = {
    Page,
    PageSize,
  };
  if (Account) body.Owner = Account;
  if (Period) body.Period = parseInt(Period);
  const headers = Account ? { Account } : {};
  const res = await axios.post(apiUrl, body, { headers });
  return res;
}

export async function getModelRewardPeriodDetail(Period) {
  const apiUrl = `${baseUrl}/period/detail`;
  const res = await axios.post(apiUrl, Period ? { Period } : {});
  return res;
}

export async function getModelRewardDetail(Period, Account) {
  const apiUrl = `${baseUrl}/detail`;
  const headers = { Account };
  const res = await axios.post(apiUrl, { Period, Owner: Account }, { headers });
  return res;
}
