import { useImperativeHandle, forwardRef } from "react";
import * as solanaProgram from "../services/solana-program";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import webconfig from "../webconfig";
import { formatBalance } from "../utils";

function SolanaAction(props, ref) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  useImperativeHandle(ref, () => ({
    makeOffer,
    placeOrder,
    renewOrder,
    refundOrder,
    cancelOffer,
    getTokenAccountBalance,
    claimRewards,
  }));
  // Seller's Device Make Offer
  const makeOffer = async (machinePublicKey, price, duration, disk) => {
    solanaProgram.initProgram(connection, wallet);
    let result = await solanaProgram.makeOffer(
      machinePublicKey,
      parseFloat(price),
      duration,
      disk
    );
    return result;
  };
  // Unlist Device From Market
  const cancelOffer = async (machinePublicKey) => {
    solanaProgram.initProgram(connection, wallet);
    let result = await solanaProgram.cancelOffer(machinePublicKey);
    return result;
  };
  // Rent Device On Market
  const placeOrder = async (machinePublicKey, orderId, duration, metadata) => {
    await solanaProgram.initProgram(connection, wallet);
    let result = await solanaProgram.placeOrder(
      machinePublicKey,
      orderId,
      duration,
      metadata
    );
    return result;
  };
  // Extend Renting Duration
  const renewOrder = async (machinePublicKey, orderId, duration) => {
    await solanaProgram.initProgram(connection, wallet);
    const [orderPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("order"),
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.hex.decode(orderId),
      ],
      webconfig.PROGRAM
    );
    const result = await solanaProgram.renewOrder(
      machinePublicKey,
      orderPublicKey,
      duration
    );
    return result;
  };
  // Refund Order
  const refundOrder = async (machinePublicKey, orderId, sellerPublicKey) => {
    await solanaProgram.initProgram(connection, wallet);
    const [orderPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("order"),
        wallet.publicKey.toBytes(),
        anchor.utils.bytes.hex.decode(orderId),
      ],
      webconfig.PROGRAM
    );
    const result = await solanaProgram.refundOrder(
      machinePublicKey,
      orderPublicKey,
      sellerPublicKey
    );
    return result;
  };
  // Claim Period Rewards
  const claimRewards = async (rewards) => {
    try {
      await solanaProgram.initProgram(connection, wallet);
      const transactions = [];
      const blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;
      for (let reward of rewards) {
        const transaction = new Transaction();
        const [publicKey] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("machine"),
            wallet.publicKey.toBytes(),
            anchor.utils.bytes.hex.decode(reward.MachineId),
          ],
          webconfig.PROGRAM
        );
        let instruction = await solanaProgram.claimRewards(
          publicKey,
          reward.MachineId,
          wallet.publicKey,
          Number(reward.Period)
        );
        transaction.add(instruction);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        transactions.push(transaction);
      }
      const signedTx = await wallet.signAllTransactions(transactions);
      const sentTxns = [];
      for await (const tx of signedTx) {
        const confirmTransaction = await connection.sendRawTransaction(
          tx.serialize()
        );
        sentTxns.push(confirmTransaction);
      }
      return { msg: "ok", data: sentTxns };
    } catch (e) {
      return { msg: e.message };
    }
  };
  // Get User's DIST Balance
  const getTokenAccountBalance = async (mint, address) => {
    const [tokenAddress] = PublicKey.findProgramAddressSync(
      [address.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    try {
      let token = await connection.getTokenAccountBalance(tokenAddress);
      return formatBalance(token.value.amount);
    } catch (e) {
      throw e;
    }
  };
  return "";
}
export default forwardRef(SolanaAction);
