import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as util from "../utils";

import webconfig from "../webconfig";

const rpcUrl = "https://api.devnet.solana.com";

let connection = null;
let provider = null;

export async function connectToSolana() {
  try {
    if (connection) return connection;
    console.log("rpcUrl", rpcUrl);
    connection = new Connection(rpcUrl, "confirmed");
    await connection.getVersion();
    return connection;
  } catch (error) {
    console.error("link Solana error:", error);
    return null;
  }
}
export async function getBalance(accountId) {
  try {
    const publicKey = new PublicKey(accountId);
    const connection = await connectToSolana();
    let balance = await connection.getBalance(publicKey);
    if (balance > 0) {
      balance = balance / LAMPORTS_PER_SOL;
    }
    return balance;
  } catch (error) {
    console.error("link to Solana error:", error);
  }
}
export async function faucet(accountId) {
  try {
    await connectToSolana();
    const publicKey = new PublicKey(accountId);
    const signature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );
    let ret = await connection.confirmTransaction(signature);
    getBalance(accountId);
    return { msg: "ok", data: ret };
  } catch (error) {
    console.error("link to Solana error:", error);
    let msg = error.message;
    if (msg.indexOf("429") !== -1) {
      msg = "Please Wait 24 hours for a refill.";
    }
    return { msg };
  }
}

//for wallet
export function getProvider() {
  if ("phantom" in window) {
    if (provider) {
      return provider;
    }
    provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      provider.on("accountChanged", (publicKey) => {
        if (publicKey) {
          console.log("Switched to account", publicKey.toString());
        } else {
          provider.connect().catch((error) => {});
        }
      });
      return provider;
    }
  }
  return null;
}
export function checkWallet() {
  const isPhantomInstalled = window.phantom?.solana?.isPhantom;
  return isPhantomInstalled;
}
export async function getPublicKey() {
  try {
    getProvider();
    const res = await provider.connect();
    let account = res.publicKey.toString();
    return account;
  } catch (error) {
    console.error("link Solana error:", error);
    return null;
  }
}
