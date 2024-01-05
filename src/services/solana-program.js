// Solana 功能
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { formatBalance } from "../utils/format";
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
export async function makeOffer(
  connection,
  walletAn,
  machinePublicKey,
  price,
  maxDuration,
  disk
) {
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
    console.log("transaction", transaction);
    return { msg: "ok", data: transaction };
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
    console.log("transaction", transaction);
    return { msg: "ok", data: transaction };
  } catch (e) {
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
  console.log({ machinePublicKey, orderId, duration, metadata });
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
    console.log("OrderPublicKey", publick.toString());
    if (!walletAn || !walletAn.publicKey) {
      return { msg: "error", error: "walletAn is null" };
    }

    duration = new anchor.BN(duration);
    metadata.machinePublicKey = publick.toString();
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
    return { msg: "ok", data: transaction };
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
    return { msg: "ok", data: transaction };
  } catch (e) {
    console.error(e);
    return { msg: e.message };
  }
}
export async function machineList() {
  try {
    if (!program) {
      return { msg: "Please run initProgram first." };
    }
    const counterAccount = await program.account.machine.all();
    // console.log({ counterAccount });
    // console.log(JSON.stringify(counterAccount, null, 2));
    formatMachineList(counterAccount);
    console.log({ counterAccount });
    return { msg: "ok", list: counterAccount };
  } catch (e) {
    return { msg: e.message };
  }
}
export async function getMachineList() {
  let ret = await machineList();
  return ret;
}

function uint8ArrayToString(u8a) {
  return Array.prototype.map
    .call(new Uint8Array(u8a), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}
function formatMachineList(list) {
  list.forEach((t) => {
    try {
      if (t.account.uuid && Array.isArray(t.account.uuid)) {
        t.account.uuid = uint8ArrayToString(t.account.uuid);
      }
      t.publicKey = t.publicKey.toString();
      t.Uuid = t.publicKey;
      t.Status = formatMachineStatus(Object.keys(t.account.status)[0]);
      t.Metadata = JSON.parse(t.account.metadata);
      t.Addr = t.Metadata.Addr;

      let item = t;

      item.UuidShort = item.Metadata.MachineUUID.slice(-10);
      item.Cpu = item.Metadata?.CPUInfo?.ModelName;
      item.RAM = item.Metadata?.InfoMemory?.RAM.toFixed(0) + "GB";
      item.AvailHardDrive =
        item.Metadata?.DiskInfo?.TotalSpace.toFixed(0) + "GB";
      item.UploadSpeed = item.Metadata?.SpeedInfo?.Upload;
      item.DownloadSpeed = item.Metadata?.SpeedInfo?.Download;
      item.Price = formatBalance(item.Price);
      if (item.account.completedCount + item.account.failedCount <= 0) {
        item.Reliability = "--";
      } else {
        item.Reliability =
          parseInt(
            (item.account.completedCount * 100) /
              (item.account.completedCount + item.account.failedCount)
          ) + "%";
      }
      item.Score = item.account.score;
      item.TFLOPS = item.Tflops;
      item.Region = item.Metadata.LocationInfo.Country;

      //col 2
      item.GpuCount = item.Metadata.GPUInfo.Number;
      item.Gpu = item.Metadata.GPUInfo.Model;
    } catch (e) {
      console.log(e);
    }
  });
}

function formatMachineStatus(str) {
  str = str.toLocaleLowerCase();
  return str === "renting" ? 2 : str === "idle" ? 0 : 1;
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
