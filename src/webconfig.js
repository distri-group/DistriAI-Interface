// 网络配置
import store from "./utils/store";

let defaultConfig = {
  videoApiUrl: "/cmps", // 首页视频地址
  nodeURL: "https://api.devnet.solana.com",
  contractAddress: "HF4aT6sho2zTySB8nEeN5ThMvDGtGVRrH3jeBvxFNxit",
};

export default {
  isDebug: false,
  sitename: "matrixai-ui",
  isUpgrading: false,
  videoApiUrl: getConfig("videoApiUrl"),
  apiUrl: process.env.REACT_APP_API_URL, // 请求地址
  contractAddress: getConfig("contractAddress"), // 合约地址
  wsnode: {
    nodeURL: getConfig("nodeURL"), //"ws://localhost:9944"
    keyringOption: { type: "sr25519", ss58Format: 42 },
  },
  mintAddress: "896KfVVY6VRGQs1d9CKLnKUEgXXCCJcEEg7LwSK84vWE",
};
function getConfig(key) {
  let json = store.get("webconfig"); // 先从 localStorage 获取 webConfig
  if (!json) {
    return defaultConfig[key]; // 如果没有，则返回默认配置
  }
  return json[key] || defaultConfig[key];
}
