import { utils, web3, BN } from "@project-serum/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import webconfig from "@/webconfig.js";
import { formatBalance } from "./index.js";
import { enqueueSnackbar } from "notistack";
import { useProgram } from "../KeepAliveLayout.jsx";

const { PROGRAM, MINT_PROGRAM } = webconfig;
const [vault] = web3.PublicKey.findProgramAddressSync(
  [utils.bytes.utf8.encode("vault"), MINT_PROGRAM.toBytes()],
  PROGRAM
);
const systemProgram = new PublicKey("11111111111111111111111111111111");

export default function useSolanaMethod() {
  const program = useProgram();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // Seller's Device Make Offer
  const makeOffer = async (machineInfo) => {
    let { uuid, price, duration, disk } = machineInfo;
    price = parseFloat(price) * LAMPORTS_PER_SOL;
    price = new BN(price);
    duration = new BN(duration);
    disk = new BN(disk);
    try {
      const transaction = await program.methods
        .makeOffer(price, duration, disk)
        .accounts({
          machine: getMachinePublicKey(uuid),
          owner: wallet.publicKey,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Unlist Device From Market
  const cancelOffer = async (uuid) => {
    try {
      const transaction = await program.methods
        .cancelOffer()
        .accounts({
          machine: getMachinePublicKey(uuid),
          owner: wallet.publicKey,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Rent Device On Market
  const placeOrder = async (machinePublicKey, duration, metadata) => {
    duration = new BN(duration);
    metadata = JSON.stringify(metadata);
    const orderUuid = utils.bytes.utf8.encode(new Date().valueOf().toString());
    const orderArray = new Uint8Array(16);
    orderArray.set(orderUuid);
    const [orderPublicKey] = web3.PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("order"),
        wallet.publicKey.toBytes(),
        orderArray,
      ],
      PROGRAM
    );
    try {
      const transaction = await program.methods
        .placeOrder(orderUuid, duration, metadata)
        .accounts({
          machine: machinePublicKey,
          order: orderPublicKey,
          buyer: wallet.publicKey,
          buyerAta: findAssociatedTokenAddress(wallet.publicKey),
          vault,
          mint: MINT_PROGRAM,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Extend Renting Duration
  const renewOrder = async (machinePublicKey, orderUuid, duration) => {
    duration = new BN(duration);
    const [orderPublicKey] = web3.PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("order"),
        wallet.publicKey.toBytes(),
        utils.bytes.hex.decode(orderUuid),
      ],
      PROGRAM
    );
    try {
      const transaction = await program.methods
        .renewOrder(duration)
        .accounts({
          machine: machinePublicKey,
          order: orderPublicKey,
          buyer: wallet.publicKey,
          buyerAta: findAssociatedTokenAddress(wallet.publicKey),
          vault,
          mint: MINT_PROGRAM,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Refund Order
  const refundOrder = async (machinePublicKey, orderUuid, sellerPublicKey) => {
    const [orderPublicKey] = web3.PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("order"),
        wallet.publicKey.toBytes(),
        utils.bytes.hex.decode(orderUuid),
      ],
      PROGRAM
    );
    try {
      const transaction = await program.methods
        .refundOrder()
        .accounts({
          machine: machinePublicKey,
          order: orderPublicKey,
          buyer: wallet.publicKey,
          buyerAta: findAssociatedTokenAddress(wallet.publicKey),
          sellerAta: findAssociatedTokenAddress(sellerPublicKey),
          vault,
          mint: MINT_PROGRAM,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Claim Available Periodic Rewards
  const claimButchRewards = async (rewards) => {
    const transactions = [];
    try {
      const blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;
      for (const reward of rewards) {
        const transaction = new Transaction();
        const instruction = await claimReward(
          reward.MachineId,
          wallet.publicKey,
          reward.Period
        );
        transaction.add(instruction);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        transactions.push(transaction);
      }
      const signedTransactions = await wallet.signAllTransactions(transactions);
      const sentTransactions = [];
      for await (const transaction of signedTransactions) {
        const confirmTransaction = await connection.sendRawTransaction(
          transaction.serialize()
        );
        sentTransactions.push(confirmTransaction);
      }
      return sentTransactions;
    } catch (error) {
      throw handleError(error);
    }
  };

  const claimReward = async (machineUuid, ownerPublicKey, period) => {
    const [rewardPublicKey] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("reward"), new BN(period).toArray("le", 4)],
      PROGRAM
    );
    const [rewardMachinePublicKey] = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("reward-machine"),
        new BN(period).toArray("le", 4),
        ownerPublicKey.toBytes(),
        utils.bytes.hex.decode(machineUuid),
      ],
      PROGRAM
    );
    const [rewardPool] = web3.PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("reward-pool"), MINT_PROGRAM.toBytes()],
      PROGRAM
    );
    try {
      const instruction = await program.methods
        .claim(period)
        .accounts({
          machine: getMachinePublicKey(machineUuid),
          reward: rewardPublicKey,
          rewardMachine: rewardMachinePublicKey,
          owner: ownerPublicKey,
          ownerAta: findAssociatedTokenAddress(ownerPublicKey),
          rewardPool,
          mint: MINT_PROGRAM,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram,
        })
        .instruction();
      return instruction;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Create Model
  const createModel = async (model, ownerPublicKey) => {
    const hashedName = await getItemName(model.Name);
    const [modelPublicKey] = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("ai_model"),
        ownerPublicKey.toBytes(),
        hashedName,
      ],
      PROGRAM
    );
    try {
      const transaction = await program.methods
        .createAiModel(
          model.Name,
          model.Framework,
          model.License,
          model.Type1,
          model.Type2,
          model.Tags
        )
        .accounts({
          aiModel: modelPublicKey,
          owner: ownerPublicKey,
          systemProgram,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Create Dataset
  const createDataset = async (dataset, ownerPublicKey) => {
    const hashedName = await getItemName(dataset.Name);
    const [datasetPublicKey] = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("dataset"),
        ownerPublicKey.toBytes(),
        hashedName,
      ],
      PROGRAM
    );
    try {
      const transaction = await program.methods
        .createDataset(
          dataset.Name,
          dataset.Scale,
          dataset.License,
          dataset.Type1,
          dataset.Type2,
          dataset.Tags
        )
        .accounts({
          dataset: datasetPublicKey,
          owner: ownerPublicKey,
          systemProgram,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw handleError(error);
    }
  };

  // Check Transaction Confirmation On Solana
  const checkConfirmation = async (transaction) => {
    return new Promise(async (resolve, reject) => {
      try {
        const latestBlockHash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction(
          {
            blockhash: latestBlockHash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: transaction,
          },
          "confirmed"
        );
        setTimeout(() => {
          resolve(confirmation);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Get User's Associated-Token-Address
  const findAssociatedTokenAddress = (publicKey) => {
    const [associatedTokenAddress] = PublicKey.findProgramAddressSync(
      [
        publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        MINT_PROGRAM.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return associatedTokenAddress;
  };

  // Get Machine's PublicKey
  const getMachinePublicKey = (uuid, owner) => {
    const [machinePublicKey] = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("machine"),
        (owner ?? wallet.publicKey).toBytes(),
        utils.bytes.hex.decode(uuid),
      ],
      PROGRAM
    );
    return machinePublicKey;
  };

  // Get User's DIST Balance
  const getTokenBalance = async (publicKey) => {
    try {
      const tokenAccount = findAssociatedTokenAddress(publicKey);
      const token = await connection.getTokenAccountBalance(tokenAccount);
      return formatBalance(token.value.amount);
    } catch (error) {
      const err = handleError(error);
      if (err.message.includes("could not find account")) {
        enqueueSnackbar(
          "Token account not initialzed. Please go to Faucet and claim DIST before operating.",
          { variant: "warning" }
        );
        return 0;
      }
    }
  };

  const handleError = (error) => {
    if (!program) {
      return new Error(
        "Solana program not initialized. Please check your network connection and refresh the page."
      );
    }
    if (error.message.includes("found no record of a prior credit.")) {
      const error = new Error(
        "Token account not initialized. Please go to Faucet and claim DIST before operating."
      );
      error.insufficient = true;
      return error;
    } else if (error.message.includes("custom program error: 0x1")) {
      const error = new Error("Insufficient token balance.");
      error.insufficient = true;
      return error;
    } else if (error.message.includes("custom program error: 0xbc4")) {
      return new Error("Insufficient reward pool balance.");
    }
    return error;
  };

  const getItemName = async (name) => {
    const data = new TextEncoder().encode(name);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashUint8Array = new Uint8Array(hashBuffer);
    return hashUint8Array;
  };

  const methods = {
    makeOffer,
    cancelOffer,
    placeOrder,
    renewOrder,
    refundOrder,
    claimButchRewards,
    createModel,
    createDataset,
    getTokenBalance,
    getMachinePublicKey,
  };

  return { wallet, methods };
}
