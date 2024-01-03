// 发币接口
import { request } from "../utils";
let apiUrl = "/faucet-api";

// let apiUrl="http://127.0.0.1/transfer";

export function submit(data) {
  return request.post(apiUrl, { data });
}
