import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export { formatBalance, formatAddress, getTotal, copy };

function formatBalance(balance) {
  return Math.floor((balance / LAMPORTS_PER_SOL) * 100) / 100;
}
function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
}
function getTotal(price, duration) {
  var m = 0,
    s1 = price.toString(),
    s2 = duration.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
}
function copy(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {})
    .catch((error) => {});
}
