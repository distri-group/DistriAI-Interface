import { PublicKey } from "@solana/web3.js";

const webconfig = {
  apiUrl: process.env.REACT_APP_API_URL,
  PROGRAM: new PublicKey(process.env.REACT_APP_PROGRAM),
  MINT_PROGRAM: new PublicKey("2mdavGYoNKKYVx4RvM36pPH6MJ1hr6TjkkcdFzCcpFZR"),
};
export default webconfig;
