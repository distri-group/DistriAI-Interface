import request from "../utils/request";

const apiUrl = "/index-api/faucet";

export async function faucet(addr) {
  let res = await request.post(apiUrl, { data: { Account: addr } });
  return res;
}
