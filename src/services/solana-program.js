import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import webconfig from "../webconfig";
import idl from "./idl.json";

const PROGRAM_ID = webconfig.contractAddress;
let program = null;
let connection = null;
let walletAn = null;
const mint = new PublicKey(webconfig.mintAddress);
let vault = null;
let associatedTokenAccount = null;
export async function initProgram(conn, wallet) {
  try {
    if (program && walletAn?.publicKey) return program;
    connection = conn;
    walletAn = wallet;
    let provider;
    try {
      provider = anchor.getProvider();
    } catch {
      provider = new anchor.AnchorProvider(connection, walletAn, {});
    }
    if (!provider) provider = window.phantom?.solana;
    anchor.setProvider(provider);
    program = new anchor.Program(idl, PROGRAM_ID);
    associatedTokenAccount = findAssociatedTokenAddress(
      walletAn.publicKey,
      mint
    );
    vault = await getVault();
    return program;
  } catch (error) {
    console.error(error);
  }
}
export async function makeOffer(machinePublicKey, price, maxDuration, disk) {
  try {
    if (!program) {
      return { msg: "Please run initProgram first." };
    }
    if (typeof price == "string") {
      price = parseFloat(price);
    }
    price = price * LAMPORTS_PER_SOL;
    price = new anchor.BN(price);
    maxDuration = new anchor.BN(maxDuration);
    disk = new anchor.BN(disk);
    if (!walletAn || !walletAn.publicKey) {
      return { msg: "walletAn is null,Please run initProgram first." };
    }
    const transaction = await program.methods
      .makeOffer(price, maxDuration, disk)
      .accounts({
        machine: new PublicKey(machinePublicKey),
        owner: walletAn.publicKey,
      })
      .rpc();
    let res = await checkConfirmation(connection, transaction);
    if (res) {
      return { msg: "ok", data: transaction };
    }
  } catch (e) {
    console.error(e);
    return { msg: e.message };
  }
}
export async function cancelOffer(machinePublicKey) {
  try {
    if (!program) {
      return { msg: "Please run initProgram first." };
    }
    const transaction = await program.methods
      .cancelOffer()
      .accounts({
        machine: machinePublicKey,
        owner: walletAn.publicKey,
      })
      .rpc();
    let res = await checkConfirmation(connection, transaction);
    if (res) {
      return { msg: "ok", data: transaction };
    }
  } catch (e) {
    console.log(e);
    return { msg: e.message };
  }
}
export function getPublicKeyFromStr(name, ownerPublicKeyStr, str) {
  let orderId = anchor.utils.bytes.hex.encode("0x" + str);
  var myUint8Array = new Uint8Array(16);
  myUint8Array.set(orderId);
  orderId = myUint8Array;
  let counterSeed = anchor.utils.bytes.utf8.encode(name);
  let puk = new PublicKey(ownerPublicKeyStr);
  let seeds = [counterSeed, puk.publicKey.toBytes(), orderId];
  let [publick] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    new PublicKey(PROGRAM_ID)
  );
  return publick;
}
export async function placeOrder(
  machinePublicKey,
  orderId,
  duration,
  metadata
) {
  try {
    if (!program) {
      return { msg: "Please run initProgram first." };
    }
    if (typeof orderId == "string") {
      orderId = anchor.utils.bytes.utf8.encode(orderId);
    }
    var myUint8Array = new Uint8Array(16);
    myUint8Array.set(orderId);
    orderId = myUint8Array;
    if (typeof duration == "string") {
      duration = parseInt(duration);
    }
    let counterSeed = anchor.utils.bytes.utf8.encode("order");
    let seeds = [counterSeed, walletAn.publicKey.toBytes(), orderId];
    let [publick] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      new PublicKey(PROGRAM_ID)
    );
    if (!walletAn || !walletAn.publicKey) {
      return { msg: "error", error: "walletAn is null" };
    }
    duration = new anchor.BN(duration);
    metadata.machinePublicKey = machinePublicKey;
    metadata = JSON.stringify(metadata);
    const transaction = await program.methods
      .placeOrder(orderId, duration, metadata)
      .accounts({
        machine: machinePublicKey,
        order: publick,
        buyer: walletAn.publicKey,
        buyerAta: associatedTokenAccount,
        vault,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();
    let res = await checkConfirmation(connection, transaction);
    if (res) {
      return { msg: "ok", data: transaction };
    }
  } catch (e) {
    console.error(e);
    return { msg: e.message };
  }
}
export async function renewOrder(machinePublicKey, orderPublicKey, duration) {
  try {
    if (!program) {
      return { msg: "Please run initProgram first." };
    }
    if (typeof duration == "string") {
      duration = parseInt(duration);
    }
    duration = new anchor.BN(duration);
    const transaction = await program.methods
      .renewOrder(duration)
      .accounts({
        machine: machinePublicKey,
        order: orderPublicKey,
        buyer: walletAn.publicKey,
        buyerAta: associatedTokenAccount,
        vault,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();
    let res = await checkConfirmation(connection, transaction);
    if (res) {
      return { msg: "ok", data: transaction };
    }
  } catch (e) {
    console.error(e);
    return { msg: e.message };
  }
}

const findAssociatedTokenAddress = (walletAddress, tokenMintAddress) => {
  return PublicKey.findProgramAddressSync(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
};
export const getVault = async () => {
  let counterSeed = anchor.utils.bytes.utf8.encode("vault");
  let seeds = [counterSeed, mint.toBytes()];
  let [publick] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    new PublicKey(webconfig.contractAddress)
  );
  return publick;
};

const checkConfirmation = async (connection, tx) => {
  const latestBlockHash = await connection.getLatestBlockhash();
  const confirmation = await connection.confirmTransaction(
    {
      blockhash: latestBlockHash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    },
    "finalized"
  );
  return confirmation;
};
