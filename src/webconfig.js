import { PublicKey } from "@solana/web3.js";

const webconfig = {
  apiUrl: process.env.REACT_APP_API_URL,
  // mainnet
  // PROGRAM: new PublicKey("HF4aT6sho2zTySB8nEeN5ThMvDGtGVRrH3jeBvxFNxit"),
  // testnet
  PROGRAM: new PublicKey("8WxFh7ZtvTP1587yvyweoRMt41hCHMsmM48PTbZKM4tY"),
  MINT_PROGRAM: new PublicKey("896KfVVY6VRGQs1d9CKLnKUEgXXCCJcEEg7LwSK84vWE"),
};
export default webconfig;
