import {
  Connection,
  sendAndConfirmTransaction,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
import store from "../utils/store";
import * as util from "../utils";

import idl from "./idl.json";
import webconfig from "../webconfig";

const rpcUrl = webconfig.wsnode.nodeURL;

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
    await connectToSolana();
    let balance = await connection.getBalance(publicKey);
    if (balance > 0) {
      balance = balance / 1000000000;
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
    console.log({ ret });
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
export async function freshAccountBalance() {
  try {
    let account = await getAccountInfoFromStore();
    await setPublicKey(account.address);
  } catch (error) {
    console.error("link to Solana error:", error);
  }
}

//for wallet
export function getProvider() {
  if ("phantom" in window) {
    if (provider) {
      return provider;
    }
    console.log("Provider not exist!");
    provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      provider.on("accountChanged", (publicKey) => {
        console.log("accountChanged");
        if (publicKey) {
          // Set new public key and continue as usual
          console.log(`Switched to account ${publicKey.toBase58()}`);
          window.freshBalance();
          setPublicKey(publicKey);
        } else {
          // Attempt to reconnect to Phantom
          provider.connect().catch((error) => {
            // Handle connection failure
          });
        }
      });
      return provider;
    }
  }
  util.alert("No wallet plugin detected, please install it first", () => {
    // window.open("https://phantom.app/", "_blank");
    return;
  });
  return null;
}
export function checkWallet() {
  const isPhantomInstalled = window.phantom?.solana?.isPhantom;
  return isPhantomInstalled;
}
export async function getPublicKey() {
  try {
    getProvider();
    const resp = await provider.connect();
    let acc = resp.publicKey.toString();
    await setPublicKey(acc);
    return acc;
  } catch (error) {
    console.error("link Solana error:", error);
    return null;
  }
}
export async function setPublicKey(publicKey) {
  localStorage.setItem("addr", publicKey);
  let balance = await getBalance(publicKey);
  let account = {
    address: publicKey,
    balance,
    balance_str: balance + " SOL",
  };
  store.set("account", account);
  store.set("accounts", [account]);
}
export function getAccountInfoFromStore() {
  return store.get("account");
}
