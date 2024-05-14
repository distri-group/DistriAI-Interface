import axios from "@/utils/axios.js";
import types from "@/services/types.json";
import { utils } from "@project-serum/anchor";
import { getProvider } from "@/utils/index.js";
import { create } from "kubo-rpc-client";

export async function getItemList(type, pageIndex, pageSize, filter) {
  const apiUrl = `/${type}/list`;
  let headers = {};

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
    const res = await axios.post(apiUrl, body, { headers });
    for (let item of res.List) {
      item = formatItem(item);
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getLikeList(type, pageIndex, pageSize, publicKey) {
  const apiUrl = `/${type}/likes`;
  let headers = {};
  if (publicKey) {
    const token = await login(publicKey);
    headers.Authorization = token;
  }
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
  };
  try {
    const res = await axios.post(apiUrl, body, { headers });
    for (let item of res.List) {
      item = formatItem(item);
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getItemDetail(type, owner, name) {
  const apiUrl = `/${type}/${owner}/${name}`;
  try {
    const res = await axios.get(apiUrl);
    return formatItem(res);
  } catch (error) {
    throw error;
  }
}

export async function isItemLiked(type, owner, name, publicKey) {
  const apiUrl = `/${type}/islike`;
  const token = await login(publicKey);
  const headers = {
    Authorization: token,
  };
  try {
    const res = await axios.get(apiUrl, {
      params: {
        Owner: owner,
        Name: name,
      },
      headers,
    });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function likeItem(type, owner, name, publicKey, isLiked) {
  const apiUrl = `/${type}/like`;
  const token = await login(publicKey);
  const headers = {
    Authorization: token,
  };
  try {
    const res = await axios.post(
      apiUrl,
      {
        Owner: owner,
        Name: name,
        Like: isLiked,
      },
      { headers }
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function downloadItem(type, owner, name) {
  const apiUrl = `/${type}/download`;
  try {
    const res = await axios.post(apiUrl, {
      Owner: owner,
      Name: name,
    });
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
      if (token.expired > Date.now() && token.publicKey === publicKey) {
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
          publicKey,
        })
      );
      return res;
    } catch (error) {
      throw error;
    }
  }
}

async function formatItem(item) {
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
  return item;
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
export const scales = ["<1k", "1k-10k", "10k-100k", "100k-1M", ">1M"];
export const filterData = {
  OrderBy: [
    { label: "Auto Sort", value: "all" },
    { label: "Updated Time", value: "update_time DESC" },
    { label: "Likes", value: "likes DESC" },
    { label: "Downloads", value: "downloads DESC" },
  ],
};
