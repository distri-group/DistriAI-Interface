import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// const rpcUrl = "https://api.devnet.solana.com";
const rpcUrl =
  "https://solana-devnet.g.alchemy.com/v2/2h8WfGQlu5CkB0SVf_zHWpi7gsZP-rs2";
let connection = null;

async function connectToSolana() {
  try {
    if (connection) return connection;
    connection = new Connection(rpcUrl, "confirmed");
    await connection.getVersion();
    return connection;
  } catch (error) {
    console.error("link Solana error:", error);
    return null;
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
