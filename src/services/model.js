import axios from "@/utils/axios.js";
import types from "@/services/types.json";
import { utils } from "@project-serum/anchor";
import { getProvider } from "@/utils/index.js";

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

export async function generatePresignUrl(Id, FilePath, publicKey) {
  const apiUrl = baseUrl + "/presign";
  const token = await login(publicKey);
  const body = {
    Id,
    FilePath,
    Method: "PUT",
  };
  const headers = {
    Authorization: token,
  };
  try {
    const res = await axios.post(apiUrl, body, { headers });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function login(publicKey) {
  if (localStorage.getItem("token")) return localStorage.getItem("token");
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
    localStorage.setItem("token", res);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function fileUpload(url, file) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Length": file.size,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file (${response.status})`);
    }

    const responseBody = await response.text();
    return responseBody;
  } catch (error) {
    throw error;
  }
}

export async function formatItem(model) {
  if (model.Tags.includes(",")) {
    model.Tags = model.Tags.split(",");
  } else if (!model.Tags.length) model.Tags = null;
  else {
    model.Tags = [model.Tags];
  }
  model.license = licenses[model.License - 1];
  if (model.Framework) model.framework = frameworks[model.Framework - 1];
  model.type1 = types[model.Type1 - 1].title;
  model.type2 = types[model.Type1 - 1].items[model.Type2 - 1];
  model.expanded = false;
  const [likes, downloads] = generateNumbers(model.Name);
  model.likes = likes;
  model.downloads = downloads;
  return model;
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
