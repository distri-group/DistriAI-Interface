import { useImperativeHandle, forwardRef } from "react";
import * as solanaProgram from "../services/solana-program";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

function Home(props, ref) {
  const { connection } = useConnection();
  const walletAn = useAnchorWallet();
  useImperativeHandle(ref, () => ({
    makeOffer,
    placeOrder,
    renewOrder,
    cancelOffer,
    getTokenAccountBalance,
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
  const renewOrder = async (machinePublicKey, orderPublicKey, duration) => {
    console.log({ machinePublicKey, orderPublicKey, duration });
    await solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.renewOrder(
      machinePublicKey,
      orderPublicKey,
      duration
    );
    return result;
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
      console.log(e);
    }
  };
  return "";
}
export default forwardRef(Home);
