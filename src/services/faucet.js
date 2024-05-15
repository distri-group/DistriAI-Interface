import axios from "@/utils/axios.js";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

// Get DIST Faucet
export async function DISTFaucet(publicKey) {
  const res = await axios.post("/faucet", { Account: publicKey });
  return res;
}

// Get SOL Faucet
export async function SOLFaucet(publicKey) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const signature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      LAMPORTS_PER_SOL
    );
    const latestBlockHash = await connection.getLatestBlockhash();
    const res = await connection.confirmTransaction({
      blockhash: latestBlockHash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature,
    });
    return res;
  } catch (error) {
    let msg = error.message;
    if (msg.indexOf("429") !== -1) {
      msg =
        "You have requested too many airdrops. Please wait 24 hours for a refill.";
    } else {
      msg = "Failed to claim airdrop.Try again later.";
    }
    throw new Error(msg);
  }
}
