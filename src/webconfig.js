import { PublicKey } from "@solana/web3.js";

const webconfig = {
  apiUrl: process.env.REACT_APP_API_URL,
  // mainnet
  PROGRAM: new PublicKey("6yFTDdiS1W9T9yg6YejkwKggkEE4NYqdSSzVqQvuLn16"),
  // testnet
  // PROGRAM: new PublicKey("8WxFh7ZtvTP1587yvyweoRMt41hCHMsmM48PTbZKM4tY"),
  MINT_PROGRAM: new PublicKey("896KfVVY6VRGQs1d9CKLnKUEgXXCCJcEEg7LwSK84vWE"),
};
export default webconfig;
