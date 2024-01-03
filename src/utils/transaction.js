import {
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  TokenAccountNotFoundError,
  createAssociatedTokenAccount,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
// import * as cex from "../services/cex";
import * as util from "../utils";
import { getProvider } from "../services/solana";
import webconfig from "../webconfig";

const serverKeypair = Keypair.fromSecretKey(
  bs58.decode(
    "2py8uvpGazsSm9zmFSjkx6q37C5fmvTkg2k4hy9H2aaWYiXqs9WTK1aq15W1Y3Dj7vF8KCYMpMQ11dTfQViaxnUC"
  )
);
const mint = new PublicKey(webconfig.mintAddress);
// 获取代币Ata
const getAta = async (connection, wallet) => {
  const serverAta = await getOrCreateAssociatedTokenAccount(
    connection,
    serverKeypair,
    mint,
    serverKeypair.publicKey
  );
  console.log(serverAta);
  let userAta;
  try {
    const ata = await getAssociatedTokenAddress(mint, wallet.publicKey);
    userAta = await getAccount(connection, ata);
  } catch (e) {
    console.log(e);
    if (e instanceof TokenAccountNotFoundError) {
      console.log("TokenAccount Not Found");
      try {
        userAta = await createAssociatedTokenAccount(
          connection,
          serverKeypair,
          mint,
          wallet.publicKey
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
  return { serverAta, userAta };
};
// 创建交易
const createTransaction = async (amount, from, to, connection) => {
  const instruction = SystemProgram.transfer({
    fromPubkey: from,
    toPubkey: to,
    lamports: amount * 1000000000,
  });
  const transaction = new Transaction().add(instruction);
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  return transaction;
};

const depositeTransaction = async (amount, address, connection) => {
  const transaction = await createTransaction(
    amount,
    address,
    serverKeypair.publicKey,
    connection
  );
  transaction.feePayer = address;
  return transaction;
};

const signAndSendTransaction = async (transaction, provider) => {
  try {
    const { signature } = await provider.signAndSendTransaction(transaction);
    return signature;
  } catch (e) {
    console.log("error signing transaction:", e.message);
    throw e;
  }
};

const pollSignatureStatus = async (signature, connection) => {
  let count = 0;
  const POLLING_INTERVAL = 1000; // one second
  const MAX_POLLS = 30;
  const interval = setInterval(async () => {
    if (count === MAX_POLLS) {
      clearInterval(interval);
      console.log("Failed to get transaction status");
      return;
    }
    const { value } = await connection.getSignatureStatus(signature);
    const confirmationStatus = value?.confirmationStatus;

    if (confirmationStatus) {
      const hasReachedSufficientCommitment =
        confirmationStatus === "confirmed" ||
        confirmationStatus === "finalized";
      if (hasReachedSufficientCommitment) {
        clearInterval(interval);
        console.log("Status:", confirmationStatus);
        return confirmationStatus;
      }
    } else {
      console.log("Waiting on confirmation...");
    }
    count++;
  }, POLLING_INTERVAL);
};

// export const deposite = async (amount, wallet, connection, type, id) => {
//   const provider = getProvider();
//   if (type === "SOL") {
//     const transaction = await depositeTransaction(
//       amount,
//       wallet.publicKey,
//       connection
//     );
//     const signature = await signAndSendTransaction(transaction, provider);
//     await pollSignatureStatus(signature, connection);
//   } else if (type === "CSG") {
//     await tokenDeposite(connection, wallet, amount, provider);
//   }
//   try {
//     let res = await cex.deposite(id, amount, type);
//     util.showOK(`Deposite ${amount} ${type} success.`);
//     return res;
//   } catch (e) {
//     util.showError(e.message);
//     throw e;
//   }
// };
// const tokenDeposite = async (connection, wallet, amount, provider) => {
//   const { serverAta, userAta } = await getAta(connection, wallet);
//   const transaction = new Transaction().add(
//     createTransferInstruction(
//       userAta.address,
//       serverAta.address,
//       wallet.publicKey,
//       amount * 1000000000
//     )
//   );
//   const latestBlockhash = await connection.getLatestBlockhash();
//   transaction.recentBlockhash = await latestBlockhash.blockhash;
//   transaction.feePayer = wallet.publicKey;
//   const signature = await signAndSendTransaction(transaction, provider);
//   await pollSignatureStatus(signature, connection);
// };

// export const withdraw = async (amount, wallet, connection, type, id) => {
//   if (type === "SOL") {
//     const transaction = await createTransaction(
//       amount,
//       serverKeypair.publicKey,
//       wallet.publicKey,
//       connection
//     );
//     transaction.sign(serverKeypair);
//     await sendAndConfirmTransaction(connection, transaction, [serverKeypair]);
//   } else if (type === "CSG") {
//     await tokenWithdraw(connection, wallet, amount);
//   }
//   try {
//     let res = await cex.withdraw(id, amount, type);
//     util.showOK(`Withdraw ${amount} ${type} success.`);
//     return res;
//   } catch (e) {
//     util.showError(e.message);
//     throw e;
//   }
// };
// const tokenWithdraw = async (connection, wallet, amount) => {
//   const { serverAta, userAta } = await getAta(connection, wallet);
//   const signature = await transfer(
//     connection,
//     serverKeypair,
//     serverAta.address,
//     userAta.address,
//     serverKeypair.publicKey,
//     amount * 1000000000
//   );
//   await pollSignatureStatus(signature, connection);
// };
