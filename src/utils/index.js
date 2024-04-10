import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export { formatBalance, formatAddress, getProvider };

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
function getProvider() {
  if ("phantom" in window) {
    const anyWindow = window;
    const provider = anyWindow.phantom?.solana;
    if (provider) {
      return provider;
    }
  }
  return null;
}
