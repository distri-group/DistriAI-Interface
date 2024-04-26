import axios from "@/utils/axios.js";
import types from "@/services/types.json";
import { utils } from "@project-serum/anchor";
import { getProvider } from "@/utils/index.js";
import { scales } from "./dataset.js";
import { create } from "kubo-rpc-client";

const baseUrl = "/model";

export async function getModelList(pageIndex, pageSize, filter) {
  const apiUrl = baseUrl + "/list";
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
  };
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== "all") {
        body[key] = value;
      }
    });
  }
  try {
    const res = await axios.post(apiUrl, body);
    for (let model of res.List) {
      model = formatItem(model);
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getModelDetail(owner, name) {
  const apiUrl = baseUrl + `/${owner}/${name}`;
  try {
    const res = await axios.get(apiUrl);
    return formatItem(res);
  } catch (error) {
    throw error;
  }
}

export async function checkDeployable(model) {
  const client = create({ url: "https://ipfs.distri.ai/rpc/api/v0" });
  try {
    for await (const file of client.files.ls(
      `/distri.ai/model/${model.Owner}/${model.Name}`
    )) {
      if (file.name === "deployment" && file.type === "directory") {
        try {
          const list = [];
          for await (const item of client.files.ls(
            `/distri.ai/model/${model.Owner}/${model.Name}/deployment`
          )) {
            list.push(item);
          }
          if (list.length > 0) return true;
        } catch (error) {
          return false;
        }
        return false;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function createModel(model, publicKey) {
  const apiUrl = baseUrl + "/create";
  const token = await login(publicKey);
  const headers = {
    Authorization: token,
  };
  try {
    const res = await axios.post(apiUrl, model, { headers });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function login(publicKey) {
  if (localStorage.getItem("token")) {
    let token;
    try {
      token = JSON.parse(localStorage.getItem("token"));
      if (token.expired > Date.now()) {
        return token.value;
      } else {
        localStorage.removeItem("token");
        return login(publicKey);
      }
    } catch (error) {
      localStorage.removeItem("token");
      return login(publicKey);
    }
  } else {
    const apiUrl = "/user/login";
    const encodeMsg = new TextEncoder().encode(`${publicKey}@distri.ai`);
    const provider = getProvider();
    const sign = await provider.signMessage(encodeMsg, "utf8");
    const Signature = utils.bytes.bs58.encode(sign.signature);
    const body = {
      Account: publicKey,
      Signature,
    };
    try {
      const res = await axios.post(apiUrl, body);
      const now = new Date();
      const expirationTime = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
      localStorage.setItem(
        "token",
        JSON.stringify({
          value: res,
          expired: new Date(expirationTime).getTime(),
        })
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export async function formatItem(item) {
  if (item.Tags.includes(",")) {
    item.Tags = item.Tags.split(",");
  } else if (!item.Tags.length) item.Tags = null;
  else {
    item.Tags = [item.Tags];
  }
  item.license = licenses[item.License - 1];
  if (item.Framework) item.framework = frameworks[item.Framework - 1];
  if (item.Scale) item.scale = scales[item.Scale - 1];
  item.type1 = types[item.Type1 - 1].title;
  item.type2 = types[item.Type1 - 1].items[item.Type2 - 1];
  item.expanded = false;
  const [likes, downloads] = generateNumbers(item.Name);
  item.likes = likes;
  item.downloads = downloads;
  return item;
}

function hashString(input) {
  const hash = utils.sha256.hash(input);
  const hashedNumber = parseInt(hash, 16);
  const numberInRange = (hashedNumber % (30001 - 3000)) + 3000;
  return Math.round(numberInRange / 100) / 10 + "k";
}

function generateNumbers(name) {
  const number1 = hashString(name);
  const number2 = hashString(name + "salt");
  return [number1, number2];
}

export const frameworks = [
  "Pytorch",
  "Tensorflow",
  "Keras",
  "MXNet",
  "PaddlePaddle",
  "Others",
];
export const licenses = [
  "Apache License 2.0",
  "MIT License",
  "GPL-2.0",
  "GPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "OpenRAlL license family",
  "BigScience OpenRAIL-M",
  "CreativeML OpenRAIL-M",
  "AFL-3.0",
  "ECL-2.0",
  "CC-BY-4.0",
  "CC-BY-NC-4.0",
  "CC-BY-NC-ND",
  "Others",
];
export const filterData = {
  OrderBy: [
    { label: "Updated Time", value: "Updated Time" },
    { label: "Likes", value: "Likes" },
    { label: "Downloads", value: "Downloads" },
  ],
};
