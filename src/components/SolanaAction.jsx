import { useImperativeHandle, forwardRef } from "react";
import * as solanaProgram from "../services/solana-program";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
window.Buffer = Buffer;
window.global = window;

function Home(props, ref) {
  const { connection } = useConnection();
  const walletAn = useAnchorWallet();
  useImperativeHandle(ref, () => ({
    makeOffer,
    placeOrder,
    renewOrder,
    cancelOffer,
    machineList,
    getToken,
    getTokenAccountBalance,
  }));
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
  const cancelOffer = async (machinePublicKey) => {
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.cancelOffer(machinePublicKey);
    return result;
  };
  const placeOrder = async (machinePublicKey, orderId, duration, metadata) => {
    await solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.placeOrder(
      machinePublicKey,
      orderId,
      duration,
      metadata
    );
    console.log(result);
    return result;
  };
  const renewOrder = async (machinePublicKey, orderPublicKey, duration) => {
    console.log({ machinePublicKey, orderPublicKey, duration });
    solanaProgram.initProgram(connection, walletAn).then(async () => {
      let result = await solanaProgram.renewOrder(
        machinePublicKey,
        orderPublicKey,
        duration
      );
      return result;
    });
  };

  const machineList = async () => {
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.machineList();
    return result;
  };
  const getToken = async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletAn.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
  };
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
