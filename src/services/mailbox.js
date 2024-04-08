import axios from "../utils/axios";
const apiUrl = "/mailbox/subscribe";

export async function subscribe(data) {
  try {
    const res = await axios.post(apiUrl, data);
    return res;
  } catch (error) {
    throw error;
  }
}
