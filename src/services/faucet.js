import { request } from "../utils";
let apiUrl = "/faucet-api";

export function submit(data) {
  return request.post(apiUrl, { data });
}
