import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export { formdataify, formatBalance, formatAddress };

function formdataify(params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    if (typeof params[key] == "object") {
      formData.append(key, JSON.stringify(params[key]));
    } else {
      formData.append(key, params[key]);
    }
  });
  return formData;
}

function formatBalance(balance) {
  if (!balance) {
    return "";
  }
  if (typeof balance === "string") {
    balance = parseInt(balance.split(",").join(""));
  }
  if (typeof balance === "object" && balance.free) {
    balance = parseInt(balance.free.toString());
  }
  if (isNaN(balance)) {
    return balance;
  }
  return Math.floor((balance / LAMPORTS_PER_SOL) * 100) / 100;
}
function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 8) + "..." + addr.slice(-8);
}
