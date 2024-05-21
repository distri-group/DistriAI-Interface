import axios from "axios";
import * as anchor from "@project-serum/anchor";

export async function getFileList(addr, path, token) {
  const res = await axios.get(
    `${addr}/distri/proxy/api/contents${path ? `/${path}` : ""}`,
    {
      params: {
        type: "directory",
        _: Date.now(),
      },
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  return res.data;
}

export async function signToken(addr, publicKey) {
  const msg = `workspace/token/${parseInt(Date.now() / 100000)}/${publicKey}`;
  const encodeMsg = new TextEncoder().encode(msg);
  const sign = await window.phantom.solana.signMessage(encodeMsg, "utf8");
  const signature = anchor.utils.bytes.bs58.encode(sign.signature);
  const res = await axios.get(`${addr}/distri/workspace/getToken/${signature}`);
  return res;
}
