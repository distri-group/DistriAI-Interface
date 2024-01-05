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
import webconfig from "../webconfig";
window.Buffer = Buffer;
window.global = window;

function Home(props, ref) {
  const { connection } = useConnection();
  const walletAn = useAnchorWallet();
  const setLoading = () => {};
  const mint = new PublicKey(webconfig.mintAddress);
  useImperativeHandle(ref, () => ({
    makeOffer,
    placeOrder,
    renewOrder,
    cancelOffer,
    machineList,
    getToken,
    getTokenAccountBalance,
  }));
  // 机器上架
  const makeOffer = async (machinePublicKey, price, duration, disk) => {
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.makeOffer(
      connection,
      walletAn,
      machinePublicKey,
      parseFloat(price),
      duration,
      disk
    );
    setLoading(false);
    return result;
  };
  const placeOrder = async (machinePublicKey, orderId, duration, metadata) => {
    setLoading(true);
    await solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.placeOrder(
      machinePublicKey,
      orderId,
      duration,
      metadata
    );
    console.log(result);
    setLoading(false);
    return result;
  };
  const renewOrder = async (machinePublicKey, orderPublicKey, duration) => {
    console.log({ machinePublicKey, orderPublicKey, duration });
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn).then(async () => {
      let result = await solanaProgram.renewOrder(
        machinePublicKey,
        orderPublicKey,
        duration
      );
      setLoading(false);
      return result;
    });
  };
  const cancelOffer = async (machinePublicKey) => {
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.cancelOffer(machinePublicKey);
    console.log(result);
    setLoading(false);
    return result;
  };
  const machineList = async () => {
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.machineList();
    setLoading(false);
    return result;
  };
  const getToken = async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletAn.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    console.log("Token List:");
    tokenAccounts.value.forEach((tokenAccount) => {
      const accountData = AccountLayout.decode(tokenAccount.account.data);
      console.log(
        `
        ${new PublicKey(accountData.mint)}
        ${accountData.amount}
        `
      );
    });
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
