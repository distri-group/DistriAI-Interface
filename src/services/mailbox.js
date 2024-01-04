import request from "../utils/request";
let apiUrl = "/api/mailbox/subscribe";

export function subscribe(data) {
  return request.post(apiUrl, { data });
}
