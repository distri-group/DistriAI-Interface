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
    orderList,
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
  // 购买机器
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
  // 机器持有者交换
  const renewOrder = async (machinePublicKey, orderPublicKey, duration) => {
    console.log("===========renewOrder==========");
    console.log({ machinePublicKey, orderPublicKey, duration });
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.renewOrder(
      machinePublicKey,
      orderPublicKey,
      duration
    );
    console.log(result);
    setLoading(false);
    return result;
  };
  // 取消订单
  const cancelOffer = async (machinePublicKey) => {
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.cancelOffer(machinePublicKey);
    console.log(result);
    setLoading(false);
    return result;
  };
  // 机器列表
  const machineList = async () => {
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.machineList();
    setLoading(false);
    return result;
  };
  // 订单列表
  const orderList = async () => {
    setLoading(true);
    solanaProgram.initProgram(connection, walletAn);
    let result = await solanaProgram.orderList();
    console.log(result);
    setLoading(false);
    return result;
  };
  // Token 相关
  const getToken = async () => {
    // 账户持有所有token合集
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

    // associated token account
    const associatedTokenAccount = findAssociatedTokenAddress(
      walletAn.publicKey,
      mint
    );
  };
  // 根据钱包地址和代币地址获取 ata
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
  // 根据铸币厂地址和用户地址查询用户指定代币账户余额
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
