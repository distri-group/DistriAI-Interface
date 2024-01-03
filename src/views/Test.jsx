import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React from "react";

export default function Test() {
  const { connection } = useConnection();
  const getTokenAccounts = async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      new PublicKey("ExCX1FnGPjYAbXREqACWp7wSWe2jFXon6pJXTKTxsn4k"),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    tokenAccounts.value.forEach((tokenAccount) => {
      const accountData = AccountLayout.decode(tokenAccount.account.data);
      console.log("Balance----------Token PublicKey");
      console.log(
        accountData.amount,
        new PublicKey(accountData.mint).toString()
      );
    });
  };

  return (
    <>
      <button onClick={getTokenAccounts}>Test</button>
    </>
  );
}
