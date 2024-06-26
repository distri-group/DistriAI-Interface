import axios from "@/utils/axios.js";
const apiUrl = "/mailbox/subscribe";

//Asynchronous function: Subscribe Service
export async function subscribe(data) {
  const res = await axios.post(apiUrl, data);
  return res;
}
