import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import request from "../utils/request";

const rpcUrl = "https://api.devnet.solana.com";

export async function connectToSolana() {
  try {
    const connection = new Connection(rpcUrl, "confirmed");
    await connection.getVersion();
    if (window.solana && window.solana.isPhantom && window.solana.publicKey) {
      const publicKey = window.solana.publicKey.toString();
      const encodeMsg = new TextEncoder().encode(`${publicKey}@distri.ai`);
      const sign = await window.phantom.solana.signMessage(encodeMsg, "utf8");
      const signature = anchor.utils.bytes.bs58.encode(sign.signature);
      await login(publicKey.toString(), signature);
    }
    return connection;
  } catch (error) {
    console.error("link Solana error:", error);
    return null;
  }
}
async function login(Account, Signature) {
  let apiUrl = "/index-api/user/login";
  let options = {
    data: {
      Account,
      Signature,
    },
  };
  const res = await request.post(apiUrl, options);
  if (res.Data) {
    window.localStorage.setItem("token", res.Data);
  }
  return res;
}
export async function faucet(accountId) {
  try {
    const connection = await connectToSolana();
    const publicKey = new PublicKey(accountId);
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    let ret = await connection.confirmTransaction(signature);
    return { msg: "ok", data: ret };
  } catch (error) {
    console.error("link to Solana error:", error);
    let msg = error.message;
    if (msg.indexOf("429") !== -1) {
      msg =
        "You have requested too many airdrops. Please wait 24 hours for a refill.";
    } else {
      msg = "Failed to claim airdrop.Try again later.";
    }
    return { msg };
  }
}
