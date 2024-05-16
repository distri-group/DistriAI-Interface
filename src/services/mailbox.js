import axios from "@/utils/axios.js";
const apiUrl = "/mailbox/subscribe";

export async function subscribe(data) {
  const res = await axios.post(apiUrl, data);
  return res;
}
