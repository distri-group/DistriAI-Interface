import {
  AnchorProvider,
  BN,
  Program,
  setProvider,
  web3,
} from "@project-serum/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import idl from "../services/idl.json";
import webconfig from "../webconfig";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { bytes } from "@project-serum/anchor/dist/cjs/utils";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const { PROGRAM, MINT_PROGRAM } = webconfig;

export default function Test() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);
  const program = new Program(idl, PROGRAM);

  const [rewardPool] = web3.PublicKey.findProgramAddressSync(
    [bytes.utf8.encode("reward-pool"), MINT_PROGRAM.toBytes()],
    PROGRAM
  );
  const [vault] = web3.PublicKey.findProgramAddressSync([
    bytes.utf8.encode("vault"),
    MINT_PROGRAM.toBytes(),
  ]);

  const makeOffer = async (machinePublicKey, machineInfo) => {
    try {
      let { price, duration, disk } = machineInfo;
      price = parseFloat(price) * LAMPORTS_PER_SOL;
      price = new BN(price);
      duration = new BN(duration);
      disk = new BN(disk);
      const transaction = await program.methods
        .makeOffer(price, duration, disk)
        .accounts({
          machine: machinePublicKey,
          owner: wallet.publicKey,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const cancelOffer = async (machinePublicKey) => {
    try {
      const transaction = await program.methods
        .cancelOffer()
        .accounts({
          machine: machinePublicKey,
          owner: wallet.publicKey,
        })
        .rpc();
      const res = await checkConfirmation(transaction);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const placeOrder = async (
    machinePublicKey,
    orderUuid,
    duration,
    metadata
  ) => {
    orderUuid = bytes.hex.decode(orderUuid);
    duration = BN(duration);
    metadata = JSON.stringify(metadata);
    const [orderPublicKey] = web3.PublicKey.findProgramAddressSync(
      [bytes.utf8.encode("order"), wallet.publicKey.toBytes(), orderUuid],
      PROGRAM
    );
    const transaction = await program.methods
      .placeOrder(orderUuid, duration, metadata)
      .accounts({
        machine: machinePublicKey,
        order: orderPublicKey,
        buyer: wallet.publicKey,
        buyerAta: findAssociatedTokenAddress(wallet.publicKey),
        vault,
      });
  };

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

  const checkConfirmation = async (transaction) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const latestBlockHash = await connection.getLatestBlockhash();
          const confirmation = await connection.confirmTransaction(
            {
              blockhash: latestBlockHash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
              signature: transaction,
            },
            "finalized"
          );
          resolve(confirmation);
        } catch (error) {
          reject(error);
        }
      }, 3000);
    });
  };
}
