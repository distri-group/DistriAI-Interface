import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function formatBalance(balance) {
  if (!balance) {
    return "";
  }
  if (typeof balance == "string") {
    balance = parseInt(balance.split(",").join(""));
  }
  if (typeof balance == "object" && balance.free) {
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
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}

export { formatBalance, formatAddress };
