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

function Home(props, ref) {
  const { connection } = useConnection();
  const walletAn = useAnchorWallet();
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
    solanaProgram.initProgram(connection, walletAn);
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
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.cancelOffer(machinePublicKey);
    return result;
  };
  // Rent Device On Market
  const placeOrder = async (machinePublicKey, orderId, duration, metadata) => {
    await solanaProgram.initProgram(connection, walletAn);
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
    await solanaProgram.initProgram(connection, walletAn);
    const [orderPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("order"),
        walletAn.publicKey.toBytes(),
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
    await solanaProgram.initProgram(connection, walletAn);
    const [orderPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("order"),
        walletAn.publicKey.toBytes(),
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
      await solanaProgram.initProgram(connection, walletAn);
      const transaction = new Transaction();
      for (let reward of rewards) {
        const [publicKey] = anchor.web3.PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode("machine"),
            walletAn.publicKey.toBytes(),
            anchor.utils.bytes.hex.decode(reward.machineUuid),
          ],
          webconfig.PROGRAM
        );
        let instruction = await solanaProgram.claimRewards(
          publicKey,
          reward.machineUuid,
          walletAn.publicKey,
          Number(reward.period)
        );
        transaction.add(instruction);
      }
      const blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletAn.publicKey;
      const provider = window.phantom.solana;
      const { signature } = await provider.signAndSendTransaction(transaction);
      const result = await solanaProgram.checkConfirmation(
        connection,
        signature
      );
      if (result) {
        return { msg: "ok", data: transaction };
      }
    } catch (e) {
      console.log(e);
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
      return token.value.amount;
    } catch (e) {
      throw e;
    }
  };
  return "";
}
export default forwardRef(Home);
